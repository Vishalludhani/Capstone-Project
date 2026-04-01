import React from "react";
import { divider, mutedText } from "../styles/common";

function Footer() {
  return (
    <footer className={divider}>
      <p className={`${mutedText} text-center`}>
        © 2025 Skeptic Blog
      </p>
    </footer>
  )
}

export default Footer