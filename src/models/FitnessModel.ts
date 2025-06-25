import { Model, ObjectID } from "@tsed/mongoose";
import { Property, Required, Description, Default } from "@tsed/schema";

@Model()
export class FitnessModel {
  @ObjectID("_id")
  _id: string;

  @Property()
  @Description("The user's email or unique identifier")
  @Required()
  email: string;

  @Property()
  @Required()
  @Description("Date and time of the walk session")
  walkDateTime: Date;

  @Property()
  @Required()
  @Description("Total distance walked in kilometers")
  distanceKm: number;

  @Property()
  @Required()
  @Description("Total duration of the walk in minutes")
  durationMinutes: number;


  @Property()
  @Description("Calories burned during the session")
  caloriesBurned?: number;

  @Property()
  @Required()
  @Description("Total distance walked in kilometers")
  @Default(1)
  goalDistanceKm: number;

  @Property()
  @Required()
  @Description("Total duration of the walk in minutes")
  @Default(30)
  goalDurationMinutes: number;


  @Property()
  @Required()
  @Description("Calories burned during the session")
  @Default(50)
  goalCaloriesBurned?: number;


  @Property()
  @Description("Optional note or tag for the session")
  note?: string;
}
