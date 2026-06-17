import ModuleHeader from '../ModuleHeader'

describe('ModuleHeader', () => {
  it('renders title', () => {
    render(<ModuleHeader title="Header" />)
    expect(screen.getByText('Header')).toBeInTheDocument()
  })
})
