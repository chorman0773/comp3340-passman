import { FieldType, type Vault } from "$lib/types";
import type { PageLoad } from "./$types";

// disable SSR
export const ssr = false;

export interface UserVault {
  id: string;
  key: string;
  name: string;
  itemSummaries: UserItemSummary[];
}

export interface UserItemSummary {
  name: string;
  username: string;
}

interface PageLoadData {
  vaults: Vault[];
}

export const load = ((): PageLoadData => {
  return {
    vaults: [
      {
        uuid: "1",
        name: "Personal Vault",
        items: [
          {
            uuid: "2",
            name: "1Password",
            summaryText: "user@example.com",
            fields: [
              {
                label: "username",
                value: {
                  base64Value: btoa("user@example.com"),
                  isMasked: false,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "password",
                value: {
                  base64Value: btoa("examplePassword"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "website",
                value: {
                  base64Value: btoa("https://my.1password.ca"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
            ],
          },
        ],
      },
      {
        uuid: "1",
        name: "Vaulty McVault Face",
        items: [
          {
            uuid: "2",
            name: "1Password",
            summaryText: "user@example.com",
            fields: [
              {
                label: "username",
                value: {
                  base64Value: btoa("user@example.com"),
                  isMasked: false,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "password",
                value: {
                  base64Value: btoa("examplePassword"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "website",
                value: {
                  base64Value: btoa("https://my.1password.ca"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
            ],
          },
        ],
      },
      {
        uuid: "1",
        name: "University of Windsor",
        items: [
          {
            uuid: "2",
            name: "1Password",
            summaryText: "user@example.com",
            fields: [
              {
                label: "username",
                value: {
                  base64Value: btoa("user@example.com"),
                  isMasked: false,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "password",
                value: {
                  base64Value: btoa("examplePassword"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "website",
                value: {
                  base64Value: btoa("https://my.1password.ca"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
            ],
          },
        ],
      },
      {
        uuid: "1",
        name: "Purolator",
        items: [
          {
            uuid: "2",
            name: "1Password",
            summaryText: "user@example.com",
            fields: [
              {
                label: "username",
                value: {
                  base64Value: btoa("user@example.com"),
                  isMasked: false,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "password",
                value: {
                  base64Value: btoa("examplePassword"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
              {
                label: "website",
                value: {
                  base64Value: btoa("https://my.1password.ca"),
                  isMasked: true,
                  type: FieldType.PlainText,
                },
              },
            ],
          },
        ],
      },
    ],
  };
}) satisfies PageLoad;
