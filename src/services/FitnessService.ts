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

  async getFitnessMetrics(email: string): Promise<unknown> {
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

  async getFitnessData(email: string, limit: number, page: number, sortRule: string): Promise<unknown> {
    const columnMapping: { [key: string]: [string, 1 | -1] } = {
      clh: ['caloriesBurned', 1],
      chl: ['caloriesBurned', -1],
      dlh: ['distanceKm', 1],
      dhl: ['distanceKm', -1],
      dulh: ['durationMinutes', 1],
      duhl: ['durationMinutes', -1],
    };
    const sortField = columnMapping[sortRule]?.[0] ?? "walkDateTime";
    const sortOrder = columnMapping[sortRule]?.[1] ?? -1;
    return await this.fitnessModel
      .find({ email })
      .sort({ [sortField]: sortOrder })
      .skip(limit * page)
      .limit(limit);

  }

  async getFitnessMonthCalender(email: string, startDateStr: string, endDateStr: string): Promise<unknown> {
    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    return await this.fitnessModel.find({
      email: email,
      walkDateTime: {
        $gte: startDate,
        $lte: endDate
      }
    });
  }

}
