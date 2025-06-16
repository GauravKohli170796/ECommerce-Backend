import { Inject, Injectable } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { FitnessModel } from "../models/FitnessModel";
import { IAddWalkPadDataRequest } from "../interfaces/fitnessInterfaces";

@Injectable()
export class FitnessService {
  constructor(@Inject(FitnessModel) private fitnessModel: MongooseModel<FitnessModel>) { }

  async addFitnessData(email: string, fitnessData: IAddWalkPadDataRequest): Promise<unknown> {
    const addFitnessData = { email, ...fitnessData };
    return await this.fitnessModel.create(addFitnessData);
  }

  async getFitnessMetrics(email: string, limit: number, page: number): Promise<unknown> {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.fitnessModel.aggregate([
      {
        $match: { email }
      },
      {
        $facet: {
          last30Entries: [
            { $sort: { walkDateTime: -1 } },
            { $skip: limit * page },
            { $limit: limit },
            {
              $group: {
                _id: null,
                totalDistance: { $sum: "$distanceKm" },
                totalDuration: { $sum: "$durationMinutes" },
                totalCalories: { $sum: "$caloriesBurned" },
                records: { $push: "$$ROOT" } // Keep all document data
              }
            }
          ],
          last7Days: [
            {
              $match: {
                walkDateTime: { $gte: sevenDaysAgo }
              }
            },
            {
              $group: {
                _id: null,
                totalDistance: { $sum: "$distanceKm" },
                totalDuration: { $sum: "$durationMinutes" },
                totalCalories: { $sum: "$caloriesBurned" }
              }
            }
          ],
          // Last 30 Days Metrics
          last30Days: [
            {
              $match: {
                walkDateTime: { $gte: thirtyDaysAgo }
              }
            },
            {
              $group: {
                _id: null,
                totalDistance: { $sum: "$distanceKm" },
                totalDuration: { $sum: "$durationMinutes" },
                totalCalories: { $sum: "$caloriesBurned" }
              }
            }
          ],
          // All-Time Metrics
          allTime: [
            {
              $group: {
                _id: null,
                totalDistance: { $sum: "$distanceKm" },
                totalDuration: { $sum: "$durationMinutes" },
                totalCalories: { $sum: "$caloriesBurned" }
              }
            }
          ],
          totalCount: [
            { $count: "count" }
          ],
        }
      }
    ]);
  }

}
