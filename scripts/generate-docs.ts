import { createOpenAPI } from "fumadocs-openapi/server";
import { generateFiles } from "fumadocs-openapi/generator";
import { join } from "node:path";

async function main() {
    const openapi = createOpenAPI({
        input: ["./content/docs/api-reference/openapi.json"],
    });

    await generateFiles({
        openapi,
        outDir: join(process.cwd(), "content/docs/api-reference"),
        mode: "tag", // or "operation" | "file" | "custom"
        index: true,
    });
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
