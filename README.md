# download-github-prs

TypeScript Node.js script to download GitHub pull request information (title, body, comments, etc.) using the [Github GraphQL API](https://docs.github.com/en/free-pro-team@latest/graphql). A single JSON file is saved for each pull request.

## Usage

1. Create a GitHub personal access token as described here (select at least "repo"): https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token

2. Run the script

    ``` sh
    $ git clone https://github.com/saltycrane/download-github-prs.git
    $ cd download-github-prs
    $ npm install
    $ cp .env.example .env
    $ # edit .env and replace XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX with the value of the newly created GitHub token
    $ npm run download
    ```
3. See the following output in the console:

    ```
    $ npm run download

    > @ download /tmp/download-github-prs
    > ts-node index.ts

    Starting download-github-prs...
    Creating directory /tmp/my-prs...
    Saving /tmp/my-prs/Recoil-pr-0001.json...
    Saving /tmp/my-prs/Recoil-pr-0002.json...
    Saving /tmp/my-prs/Recoil-pr-0003.json...
    Saving /tmp/my-prs/Recoil-pr-0004.json...
    Saving /tmp/my-prs/Recoil-pr-0005.json...
    Saving /tmp/my-prs/Recoil-pr-0006.json...
    Saving /tmp/my-prs/Recoil-pr-0007.json...
    Saving /tmp/my-prs/Recoil-pr-0008.json...
    Saving /tmp/my-prs/Recoil-pr-0009.json...
    Saving /tmp/my-prs/Recoil-pr-0010.json...
    Done.
    ```
    
4. View one of the JSON files

    ``` sh
    $ cat /tmp/my-prs/Recoil-pr-0001.json
    {
      "data": {
        "repository": {
          "nameWithOwner": "facebookexperimental/Recoil",
          "pullRequest": {
            "author": {
              "login": "facebook-github-bot"
            },
            "baseRefName": "master",
            "baseRefOid": "40e870caadc159a87e81be291ff641410ab32e8f",
            "body": "This is pull request was created automatically because we noticed your project was missing a Contributing file.\n\nCONTRIBUTING files explain how a developer can contribute to the project - which you should actively encourage.\n\nThis PR was crafted with love by Facebook's Open Source Team.",
            "closedAt": "2020-05-13T04:12:15Z",
            "comments": {
              "nodes": [
                {
                  "author": {
                    "login": "davidmccabe"
                  },
                  "body": "Already added this manually.",
                  "createdAt": "2020-05-13T04:12:15Z",
                  "reactions": {
                    "nodes": []
                  },
                  "userContentEdits": {
                    "nodes": []
                  }
                }
              ]
            },
            "commits": {
              "nodes": [
                {
                  "commit": {
                    "oid": "96f91679540362fa96a6c92611a8ef5621447b42"
                  }
                }
              ]
            },
            "createdAt": "2020-05-06T22:31:01Z",
            "files": {
              "nodes": [
                {
                  "path": "CONTRIBUTING.md"
                }
              ]
            },
            "headRefName": "automated_fixup_contributing_file_exists",
            "headRefOid": "96f91679540362fa96a6c92611a8ef5621447b42",
            "mergeCommit": null,
            "merged": false,
            "mergedAt": null,
            "mergedBy": null,
            "number": 1,
            "publishedAt": "2020-05-06T22:31:01Z",
            "reactions": {
              "nodes": []
            },
            "reviews": {
              "nodes": []
            },
            "state": "CLOSED",
            "title": "Adding Contributing file",
            "updatedAt": "2020-10-07T20:23:05Z",
            "userContentEdits": {
              "nodes": []
            }
          }
        }
      }
    }
    ```
