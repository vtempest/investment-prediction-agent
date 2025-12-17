"use server";

import { db } from "@/lib/db";
import { organizations, teams, teamMembers, users, userInvitations } from "@/lib/db/schema";
import { eq, and, or, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { sendTeamInvitationEmail } from "@/lib/email/send-invitation";

export async function createTeam(name: string, description?: string) {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return { success: false, error: "Unauthorized" };
    }
    
    const userId = session.user.id;

    // 1. Get or create a default organization for the user if none exists
    let userOrg = await db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
      with: {
        organization: true
      }
    });

    let orgId = userOrg?.organizationId;

    if (!orgId) {
       // Create a default org for the user
       const newOrgId = randomUUID();
       // Fetch user name to name the org
       const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
       
       await db.insert(organizations).values({
         id: newOrgId,
         name: `${user?.name || "User"}'s Organization`,
         ownerId: userId,
         createdAt: new Date(),
         updatedAt: new Date(),
       });

       // Add user to org
       await db.insert(organizationMembers).values({
           id: randomUUID(),
           organizationId: newOrgId,
           userId: userId,
           role: "owner",
           joinedAt: new Date(),
       });
       
       orgId = newOrgId;
    }

    // 2. Create the team
    const teamId = randomUUID();
    await db.insert(teams).values({
      id: teamId,
      organizationId: orgId,
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Add creator as team lead
    await db.insert(teamMembers).values({
      id: randomUUID(),
      teamId,
      userId,
      role: "lead",
      joinedAt: new Date(),
    });

    revalidatePath("/dashboard/settings");
    return { success: true, teamId };
  } catch (error) {
    console.error("Failed to create team:", error);
    return { success: false, error: "Failed to create team" };
  }
}

export async function getUserTeams() {
  try {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
        return [];
    }
    
    const userId = session.user.id;

    // Get all teams the user is a member of
    const memberships = await db.query.teamMembers.findMany({
      where: eq(teamMembers.userId, userId),
      with: {
        team: {
            with: {
                members: {
                    with: {
                        user: true
                    }
                }
            }
        },
      },
    });

    return memberships.map((m) => m.team);
  } catch (error) {
     console.error("Failed to get user teams:", error);
     return [];
  }
}

export async function searchUsers(query: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return [];
        }

        // Search users by name or email
        const foundUsers = await db.query.users.findMany({
            where: or(
                like(users.name, `%${query}%`),
                like(users.email, `%${query}%`)
            ),
            limit: 10,
        });

        return foundUsers.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
        }));
    } catch (error) {
        console.error("Failed to search users:", error);
        return [];
    }
}

export async function inviteMemberToTeam(teamId: string, email: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const inviterId = session.user.id;

        // 1. Check if user exists
        const user = await db.query.users.findFirst({
            where: eq(users.email, email)
        });

        if (user) {
            // User exists - add them directly to the team
            // 2. Check if already a member
            const existingMember = await db.query.teamMembers.findFirst({
                where: and(
                    eq(teamMembers.teamId, teamId),
                    eq(teamMembers.userId, user.id)
                )
            });

            if (existingMember) {
                return { success: false, error: "User is already a member of this team." };
            }

            // 3. Add to team
            await db.insert(teamMembers).values({
                id: randomUUID(),
                teamId,
                userId: user.id,
                role: "member",
                joinedAt: new Date(),
            });

            revalidatePath("/dashboard/settings");
            return { success: true, invited: false };
        } else {
            // User doesn't exist - send invitation email
            // Check if invitation already exists
            const existingInvitation = await db.query.userInvitations.findFirst({
                where: and(
                    eq(userInvitations.email, email),
                    eq(userInvitations.teamId, teamId),
                    eq(userInvitations.status, "pending")
                )
            });

            if (existingInvitation) {
                return { success: false, error: "An invitation has already been sent to this email." };
            }

            // Create invitation
            const invitationId = randomUUID();
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

            await db.insert(userInvitations).values({
                id: invitationId,
                inviterId,
                email,
                status: "pending",
                teamId,
                expiresAt,
                createdAt: new Date(),
            });

            // Get team info for the email
            const team = await db.query.teams.findFirst({
                where: eq(teams.id, teamId),
            });

            // Send invitation email
            try {
                await sendTeamInvitationEmail(email, team?.name || "Team", inviterId);
            } catch (emailError) {
                console.error("Failed to send invitation email:", emailError);
                // Continue anyway - invitation is saved in DB
            }

            revalidatePath("/dashboard/settings");
            return { success: true, invited: true };
        }
    } catch (error) {
        console.error("Failed to invite member:", error);
        return { success: false, error: "Failed to invite member" };
    }
}

export async function removeMemberFromTeam(teamId: string, userId: string) {
    try {
        await db.delete(teamMembers).where(
            and(
                eq(teamMembers.teamId, teamId),
                eq(teamMembers.userId, userId)
            )
        );

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to remove member:", error);
        return { success: false, error: "Failed to remove member" };
    }
}

export async function updateTeam(teamId: string, name: string, description?: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if user is team lead
        const membership = await db.query.teamMembers.findFirst({
            where: and(
                eq(teamMembers.teamId, teamId),
                eq(teamMembers.userId, userId)
            )
        });

        if (!membership || membership.role !== "lead") {
            return { success: false, error: "Only team leads can edit teams" };
        }

        // Update team
        await db.update(teams).set({
            name,
            description,
            updatedAt: new Date(),
        }).where(eq(teams.id, teamId));

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to update team:", error);
        return { success: false, error: "Failed to update team" };
    }
}

export async function deleteTeam(teamId: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session) {
            return { success: false, error: "Unauthorized" };
        }

        const userId = session.user.id;

        // Check if user is team lead
        const membership = await db.query.teamMembers.findFirst({
            where: and(
                eq(teamMembers.teamId, teamId),
                eq(teamMembers.userId, userId)
            )
        });

        if (!membership || membership.role !== "lead") {
            return { success: false, error: "Only team leads can delete teams" };
        }

        // Delete team (cascade will handle members)
        await db.delete(teams).where(eq(teams.id, teamId));

        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete team:", error);
        return { success: false, error: "Failed to delete team" };
    }
}

// Needed to check for organizationMembers table import above, realized I missed importing it in the top block
import { organizationMembers } from "@/lib/db/schema";
