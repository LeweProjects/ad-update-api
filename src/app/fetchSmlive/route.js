"use server"
import mysql from "mysql2/promise";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get API key from request headers
    const apiKey = req.headers.get("x-api-key");

    // Validate API key
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });

    // Fetch data
    const rows = await connection.execute("SELECT * FROM widget_multirotator");

    // Close the connection
    await connection.end();

    // Return JSON response
    // return Response.json({ success: true, data: rows }, { status: 200 });
    return NextResponse.json({ success: true, data: rows }, { status: 200 });
    // return NextResponse.json({ message: apiKey })
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: "Database query failed" }, { status: 500 });
  }
}