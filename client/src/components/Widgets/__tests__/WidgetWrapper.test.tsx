import { WidgetWrapper } from '../WidgetWrapper'

describe('WidgetWrapper', () => {
  it('renders error boundary', () => {
    render(<WidgetWrapper widgetId="test" />)
    const widget = document.querySelector('.dashboard__widget')
    expect(widget).toBeInTheDocument()
  })
})
