import "./globals.css";
import { GraphIcon, MarkGithubIcon } from "@primer/octicons-react";
import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "福井県 観光オープンデータグラフ",
  description:
    "Code4Fukuiなどによって公開されているオープンデータから観光に関するデータの可視化を行います",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="data:image/x-icon;," />
      </head>
      <body className="flex min-h-screen flex-col items-center justify-center p-4 antialiased">
        <header className="border-separator flex h-fit w-full items-center justify-start gap-x-2 border-b-2 pb-2">
          <Link
            className="group flex h-fit w-fit items-center justify-start gap-x-2 no-underline"
            href="/"
            rel="noopener noreferrer"
          >
            <GraphIcon
              size="medium"
              verticalAlign="top"
              className="group-hover:scale-120 fill-primary transition-all"
            />
            <h1 className="text-2xl font-bold transition-all group-hover:scale-110 group-hover:underline">
              福井観光DX:グラフ
            </h1>
          </Link>
        </header>
        <main className="flex h-full w-full flex-grow flex-col items-center p-4">{children}</main>
        <footer className="border-separator flex h-fit w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t-2 pt-2">
          <a className="flex items-center gap-2" href="" target="_blank">
            <MarkGithubIcon size="medium" />
            Page source
          </a>
          <a
            className="flex items-center gap-2"
            href="https://github.com/code4fukui/fukui-kanko-people-flow-data"
            target="_blank"
          >
            <MarkGithubIcon size="medium" />
            Data source
          </a>
          <a href="https://code4fukui.github.io/" target="_blank">
            <Image
              aria-hidden
              src="https://code4fukui.github.io/code4fukui_logo.svg"
              alt="code4fukui logo"
              width={100}
              height={64}
            />
          </a>
        </footer>
      </body>
    </html>
  );
}
