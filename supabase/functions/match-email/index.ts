import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { MatchNotificationEmail } from "./_templates/match-notification.tsx";
import React from "npm:react@18.3.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    });
  }

  try {
    const { fixture } = await req.json();
    
    // Render the email template
    const html = await renderAsync(
      React.createElement(MatchNotificationEmail, { fixture })
    );

    return new Response(html, {
      headers: {
        "Content-Type": "text/html",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error generating email:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate email content",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});