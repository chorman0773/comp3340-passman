import { FieldType, type Vault } from "$lib/types";
import type { LayoutLoad } from "./$types";

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
  currentVault?: string;
  vaults: Vault[];
}

export const load = (({ params }): PageLoadData => {
  return {
    currentVault: params.vault,
    vaults: [
      {
        uuid: "1",
        name: "Personal Vault",
        description: "A personal vault, just for you!",
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
        uuid: "3",
        name: "Vaulty McVault Face",
        description: "If you know, you know.",
        items: [
          {
            uuid: "4",
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
        uuid: "5",
        name: "University of Windsor",
        description:
          "Where lost students go to wander in the shadows of uncertainty and despair.",
        items: [
          {
            uuid: "6",
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
        uuid: "7",
        name: "Purolator",
        description: "My first coop <3",
        items: [
          {
            uuid: "8",
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
}) satisfies LayoutLoad;