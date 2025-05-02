import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest';
import Versioning from './Version'

import packageJson from '../../package.json'; 

test('Renders Version', () => {
  render(<Versioning version={packageJson.version} />)
  const linkElement = screen.getByText(`Current version: ${packageJson.version}`)
  expect(linkElement).toBeInTheDocument()
})

test('Does not render wrong version', () => {
  render(<Versioning version={packageJson.version} />)
  const wrongText = screen.queryByText('Current version: 9.9.9')
  expect(wrongText).not.toBeInTheDocument()
})
