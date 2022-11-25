export abstract class RouterController implements IRouterController {
  public pattern: string = '/'
  public abstract router: Router
}

export default RouterController
