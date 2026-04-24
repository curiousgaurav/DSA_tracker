#!/usr/bin/env node

/**
 * Supabase Migration Utility
 * This script helps you migrate from local PostgreSQL to Supabase
 * 
 * Usage: node migrate-to-supabase.js
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    log(`\n⏳ ${description}...`, "blue");
    exec(command, (error, stdout, stderr) => {
      if (error) {
        log(`❌ ${description} failed: ${error.message}`, "red");
        reject(error);
      } else {
        log(`✅ ${description} succeeded`, "green");
        resolve(stdout);
      }
    });
  });
}

async function migrate() {
  log("================================", "bright");
  log("  DSA Tracker Supabase Migration", "bright");
  log("================================", "bright");

  try {
    // Step 1: Verify .env file
    log("\n📋 Configuration Check", "blue");
    if (!fs.existsSync(".env")) {
      log("❌ .env file not found!", "red");
      process.exit(1);
    }

    const envContent = fs.readFileSync(".env", "utf-8");
    const isSupabase = envContent.includes("db.supabase.co");

    if (isSupabase) {
      log("✅ Supabase database detected in .env", "green");
    } else {
      log("⚠️ Looks like you're still using local database", "yellow");
      log("📝 Please update your .env with Supabase credentials first", "yellow");
      log("📖 See SUPABASE_MIGRATION.md for instructions", "yellow");
      process.exit(1);
    }

    // Step 2: Show current database info
    log("\n📊 Current Database Configuration", "blue");
    const lines = envContent.split("\n");
    lines.forEach((line) => {
      if (line.includes("DB_")) {
        const [key, value] = line.split("=");
        if (key && value && !value.includes("PASSWORD")) {
          log(`   ${key}: ${value}`, "yellow");
        }
      }
    });

    // Step 3: Test connection to Supabase
    log("\n🔗 Testing Supabase Connection", "blue");
    const testCommand = `psql -h ${process.env.DB_HOST} -U ${process.env.DB_USER} -d ${process.env.DB_NAME} -c "SELECT version();" 2>&1`;

    exec(testCommand, (error, stdout, stderr) => {
      if (error) {
        log("❌ Failed to connect to Supabase database", "red");
        log("⚠️ Check your credentials in .env file", "yellow");
        log("\nIf psql is not installed, download PostgreSQL:", "blue");
        log("👉 https://www.postgresql.org/download/", "blue");
        process.exit(1);
      } else {
        log("✅ Successfully connected to Supabase!", "green");

        // Step 4: Show next steps
        log("\n📖 Next Steps:", "bright");
        log("1. Execute the schema script on Supabase SQL Editor", "yellow");
        log('   📁 File: supabase_schema.sql', "yellow");
        log("2. (Optional) Migrate existing data from local database", "yellow");
        log("   📖 See SUPABASE_MIGRATION.md for detailed instructions", "yellow");
        log("3. Test your backend:", "yellow");
        log("   npm run dev", "yellow");
        log("\n✨ Migration Ready!", "bright");
      }
    });
  } catch (error) {
    log("\n❌ Migration failed:", "red");
    log(error.message, "red");
    process.exit(1);
  }
}

migrate();
