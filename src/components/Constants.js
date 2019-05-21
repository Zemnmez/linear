import React from "react";

export const TWITTER_HANDLE = "@zemnnmez";
export const SITE_NAME = "zemnmez";
export const FIRST_NAME = "Thomas";
export const LAST_NAME = "Shadwell";
export const MIDDLE_NAMES = ["Neil", "James"];
export const FULL_NAME = [FIRST_NAME, ...MIDDLE_NAMES, LAST_NAME];
export const USERNAME = "zemnmez";
export const GENDER = "male";

export const List = ({ }) => <table>
  {Object.entries(require(".")).map(([name, value], i) =>
    <tr key={i}><td>{name}</td><td>{JSON.stringify(value)}></td></tr> )}
</table>
