import { Property, Required } from "@tsed/schema";

export class IAddWalkPadDataRequest {
  @Property()
  note: string;

  @Property()
  @Required()
  durationMinutes: number;

  @Property()
  @Required()
  distanceKm: number;

  @Property()
  caloriesBurned: number;

  @Property()
  @Required()
  walkDateTime: Date;
}