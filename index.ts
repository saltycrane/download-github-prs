#!/usr/bin/env ts-node-script

import * as fs from "fs";
import { range } from "lodash";
import fetch from "node-fetch";

require("dotenv").config();

main();

/**
 * main
 */
async function main() {
  console.log("Starting download-github-prs...");
  makeRequiredDir(process.env.OUTPUT_DIR);
  for (const prNumber of range(
    Number(process.env.PR_START_NUMBER),
    Number(process.env.PR_END_NUMBER) + 1
  )) {
    const isDone = await fetchPullRequest(prNumber);
    if (isDone) {
      break;
    }
  }
  console.log("Done.");
}

/**
 * fetchPullRequest
 */
async function fetchPullRequest(prNumber: number) {
  const reactionFragment = `
    content
    user {
      login
    }
  `;
  const userContentEditFragment = `
    createdAt
    deletedAt
    deletedBy {
      login
    }
    diff
    editedAt
    editor {
      login
    }
    updatedAt
  `;
  const commentFragment = `
    author {
      login
    }
    body
    createdAt
    reactions(first: 100) {
      nodes {
        ${reactionFragment}
      }
    }
    userContentEdits(first: 100) {
      nodes {
        ${userContentEditFragment}
      }
    }
  `;
  const query = `
  query {
    repository(owner: "${process.env.REPO_OWNER}", name: "${process.env.REPO_NAME}") {
      nameWithOwner
      pullRequest(number: ${prNumber}) {
        author { login }
        baseRefName
        baseRefOid
        body
        closedAt
        comments(first: 100) {
          nodes {
            ${commentFragment}
          }
        }
        commits(first: 250) {
          nodes {
            commit {
              oid
            }
          }
        }
        createdAt
        files(first: 100) {
          nodes { path }
        }
        headRefName
        headRefOid
        mergeCommit { oid }
        merged
        mergedAt
        mergedBy { login }
        number
        publishedAt
        reactions(first: 10) {
          nodes {
            ${reactionFragment}
          }
        }
        reviews(first: 10) {
          nodes {
            author { login }
            body
            comments(first: 10) {
              nodes {
                ${commentFragment}
              }
            }
            commit {
              oid
            }
            createdAt
            editor { login }
            publishedAt
            reactions(first: 10) {
              nodes {
                ${reactionFragment}
              }
            }
            resourcePath
            submittedAt
            updatedAt
            userContentEdits(first: 10) {
              nodes {
                ${userContentEditFragment}
              }
            }
          }
        }
        state
        title
        updatedAt
        userContentEdits(first: 10) {
          nodes {
            ${userContentEditFragment}
          }
        }
      }
    }
  }
  `;

  // make graphql query and strigify the response
  const resp = await fetchQuery(query);

  // assume we are done if the pull request is not found
  const error = resp?.errors?.shift();
  if (error?.type === "NOT_FOUND") {
    console.log(`Pull request ${prNumber} not found. Stopping.`);
    return true;
  }

  // save json file
  const respStr = JSON.stringify(resp, null, 2);
  const filepath = [
    `${process.env.OUTPUT_DIR}/`,
    `${process.env.REPO_NAME}-pr-${String(prNumber).padStart(4, "0")}.json`,
  ].join("");
  console.log(`Saving ${filepath}...`);
  fs.writeFileSync(filepath, respStr);
}

/**
 * fetchQuery
 */
function fetchQuery(query: string, variables: Record<string, any> = {}) {
  return fetch(process.env.GITHUB_GRAPHQL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((response) => {
    return response.json();
  });
}

/**
 * makeRequiredDir
 */
function makeRequiredDir(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory ${dir}...`);
    fs.mkdirSync(dir, { recursive: true });
  }
}
