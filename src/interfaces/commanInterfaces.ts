import { Property, Required } from "@tsed/schema";
export class IUpdateMongo {
  @Property()
  @Required()
  acknowledged: boolean;

  @Property()
  @Required()
  modifiedCount: number;

  @Property()
  @Required()
  upsertedCount: number;

  @Property()
  @Required()
  matchedCount: number;
}
