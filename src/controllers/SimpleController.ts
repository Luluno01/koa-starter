export abstract class SimpleController implements ISimpleController {
  public abstract method: Method
  public pattern: string = '/'
  public abstract handler(ctx: MyAppContext, next: Next): Promise<any>
}

export default SimpleController
