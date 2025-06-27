import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { HydratedRouter } from "react-router/dom";

async function prepareApp() {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./test/mocks/browser')
    return worker.start()
  }

  return Promise.resolve()
}

prepareApp().then(() => {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
    <HydratedRouter />
      </StrictMode>,
    )
  })
})