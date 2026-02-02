import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const API_KEY = process.env.LINEAR_API_KEY;
if (!API_KEY) {
  console.error("LINEAR_API_KEY environment variable is required");
  process.exit(1);
}

async function linearGraphQL(query, variables) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    throw new Error(`Linear API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join("; "));
  }
  return json.data;
}

const server = new McpServer({
  name: "linear-project-updates",
  version: "1.0.0",
});

server.registerTool(
  "create_project_update",
  {
    title: "Create Linear Project Update",
    description:
      "Post an update to a Linear project's Updates tab. Use this instead of updating the project description when you want to post a timestamped status update.",
    inputSchema: {
      projectId: z.string().describe("Linear project ID (UUID)"),
      body: z.string().describe("Update content in Markdown format"),
      health: z
        .enum(["onTrack", "atRisk", "offTrack"])
        .default("onTrack")
        .describe("Project health status"),
    },
  },
  async ({ projectId, body, health }) => {
    const data = await linearGraphQL(
      `mutation($input: ProjectUpdateCreateInput!) {
        projectUpdateCreate(input: $input) {
          success
          projectUpdate {
            id
            url
            createdAt
          }
        }
      }`,
      {
        input: {
          projectId,
          body,
          health,
        },
      }
    );

    const result = data.projectUpdateCreate;
    if (!result.success) {
      return {
        content: [{ type: "text", text: "Failed to create project update." }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: `Project update created successfully.\nURL: ${result.projectUpdate.url}\nID: ${result.projectUpdate.id}\nCreated: ${result.projectUpdate.createdAt}`,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
