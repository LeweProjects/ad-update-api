"use server"
import mysql from "mysql2/promise";
// import { Query } from "mysql2/typings/mysql/lib/protocol/sequences/Query";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // Get API key from request headers
    const { searchParams } = new URL(req.url);
    const apiKey = req.headers.get("x-api-key");
    // const mallId = searchParams.get('mall_id');
    const query = searchParams.get('query');
    // const body = await req?.json();
    // Validate API key
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    // const { mall_id } = body;

    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    })
    ;

    // const query = `
    //   SELECT wm.label FROM widget_multirotator wm 
    //   join widget_instance wi ON wi.id = wm.widget_instance 
    //   WHERE wi.mall_id = ? and wm.end_date >= CURDATE() and wm.is_active = 1
    // `;

    // Fetch data
    const [rows] = await connection.execute(query);

    // Close the connection
    await connection.end();

    // Return JSON response
    // return Response.json({ success: true, data: rows }, { status: 200 });
    return NextResponse.json(rows);
    // return NextResponse.json({ message: apiKey })
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ success: false, error: "Database query failed" }, { status: 500 });
  }

}