import httpStatus  from 'http-status';
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utlis/catchasync";
import { premiumServices } from "./premium.server";


const getpremiumContent = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const query = req.query

    const result = await premiumServices.getpremiumcontent(query);

    res.status(200).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "Premium content retrieved successfully",
        data: result.data,
        meta : result.meta
    });
})


export const premiumController = {
    getpremiumContent
}
  