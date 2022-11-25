import { getLogger } from 'log4js'
import SimpleController from './SimpleController'
import RouterController from './RouterController'
import Home from './Home'


export const controllers: Controller[] = [
  new Home
]

export function installControllers(router: Router) {
  const logger = getLogger('app')
  for (const controller of controllers) {
    if (controller instanceof SimpleController) {
      router[controller.method](controller.pattern, controller.handler)
    } else if(controller instanceof RouterController) {
      router.use(controller.pattern, controller.router.routes(), controller.router.allowedMethods())
    } else throw new UnrecognizedControllerError(controller)
    logger.info('Controller installed for pattern', controller.pattern)
  }
}

export default installControllers

export class UnrecognizedControllerError extends TypeError {
  public override name = 'UnrecognizedControllerError'
  constructor(public controller: any) {
    super('Unrecognized controller instance')
  }
}
