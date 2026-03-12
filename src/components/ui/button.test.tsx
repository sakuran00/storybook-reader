import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { Button } from "./button"


describe("Button Component", () => {
  it("renders correctly", () => {
    render(<Button />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})