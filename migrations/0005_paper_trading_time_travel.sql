-- Add portfolio_id to positions table
ALTER TABLE `positions` ADD `portfolio_id` text REFERENCES portfolios(id);

-- Add portfolio_id, total_value, and auto_traded to trades table
ALTER TABLE `trades` ADD `portfolio_id` text REFERENCES portfolios(id);
ALTER TABLE `trades` ADD `total_value` real;
ALTER TABLE `trades` ADD `auto_traded` integer DEFAULT false;

-- Add portfolio_id and auto-trading fields to strategies table
ALTER TABLE `strategies` ADD `portfolio_id` text REFERENCES portfolios(id);
ALTER TABLE `strategies` ADD `auto_execute` integer DEFAULT false;
ALTER TABLE `strategies` ADD `auto_execute_signal_threshold` real DEFAULT 0.7;
ALTER TABLE `strategies` ADD `auto_execute_position_size` real DEFAULT 0.1;

-- Drop the unique constraint on portfolios.user_id (SQLite requires recreating the table)
-- First, create a new portfolios table with updated schema
CREATE TABLE `portfolios_new` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	`name` text NOT NULL DEFAULT 'Main Portfolio',
	`type` text NOT NULL DEFAULT 'paper',
	`is_active` integer DEFAULT true,
	`broker_account_id` text,
	`linked_broker` text,
	`time_travel_enabled` integer DEFAULT false,
	`simulation_date` integer,
	`start_date` integer NOT NULL,
	`auto_trading_enabled` integer DEFAULT false,
	`auto_trading_strategies` text,
	`auto_trading_risk_limit` real DEFAULT 0.02,
	`auto_trading_max_daily` integer DEFAULT 10,
	`initial_balance` real DEFAULT 100000,
	`total_equity` real DEFAULT 100000,
	`cash` real DEFAULT 100000,
	`stocks` real DEFAULT 0,
	`prediction_markets` real DEFAULT 0,
	`margin` real DEFAULT 0,
	`daily_pnl` real DEFAULT 0,
	`daily_pnl_percent` real DEFAULT 0,
	`total_pnl` real DEFAULT 0,
	`total_pnl_percent` real DEFAULT 0,
	`win_rate` real DEFAULT 0,
	`open_positions` integer DEFAULT 0,
	`total_trades` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

-- Copy data from old portfolios table, adding default values for new fields
INSERT INTO `portfolios_new` (
	id, user_id, name, type, is_active, start_date, initial_balance,
	total_equity, cash, stocks, prediction_markets, margin,
	daily_pnl, daily_pnl_percent, total_pnl, total_pnl_percent, win_rate, open_positions, total_trades,
	created_at, updated_at
)
SELECT
	id, user_id, 'Main Portfolio', 'paper', 1, strftime('%s', 'now'),
	total_equity, total_equity, cash, stocks, prediction_markets, margin,
	daily_pnl, daily_pnl_percent, 0, 0, win_rate, open_positions, 0,
	strftime('%s', 'now'), updated_at
FROM `portfolios`;

-- Drop old table and rename new one
DROP TABLE `portfolios`;
ALTER TABLE `portfolios_new` RENAME TO `portfolios`;
