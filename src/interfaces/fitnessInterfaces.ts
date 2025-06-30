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

  @Property()
  @Required()
  goalDurationMinutes: number;

  @Property()
  @Required()
  goalDistanceKm: number;

  @Property()
  @Required()
  goalCaloriesBurned: number;

  @Property()
  @Required()
  goalStepsWalk: number;
}
export class IGoalsDataRequest {
  @Property()
  @Required()
  goalDurationMinutes: number;

  @Property()
  @Required()
  goalDistanceKm: number;

  @Property()
  @Required()
  goalCaloriesBurned: number;

  @Property()
  @Required()
  goalStepsWalk: number;

}