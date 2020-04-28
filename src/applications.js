import { registerApplication } from 'single-spa'
import { activeFns } from './helper/apps.js'

export function registerApp(app,lifecycles) {
    registerApplication(
      app.name,
      () => {
          return Promise.resolve().then(() => {
              return lifecycles
          })
      },
      activeFns(app),
      app.customProps
    )
}

