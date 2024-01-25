import { Injectable } from "@nestjs/common";
import { FeedbackRepository } from "./feedback.repository";
import { DataSource, Timestamp } from "typeorm";
import { Feedback } from "./feedback.entity";
import { GetFeedbackDataDto, ResponseDataDto } from "./dto/feedback.dto";
import { plainToInstance } from "class-transformer";

const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const openai = new OpenAI();

@Injectable()
export class FeedbackService {
  constructor(
    private feedBackRepository: FeedbackRepository,
    private readonly dataSource: DataSource
  ) {}

  async getFeedbacktoAI(userId: string, responseDataDto: ResponseDataDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const question =
      //   "내가 오늘 하루 동안 먹은 식단의 영양성분은 탄수화물 500g, 단백질 50g, 지방 400g이야. 내 식단의 영양성분 구성을 평가해줘.";
      // const questionType = "식단평가";
      const { question, questionType, date } = responseDataDto;

      // 만약 동일 유저의 질문이 있다면, api 호출 x
      const checkdata = {
        userId,
        question,
        questionType,
        feedbackDate: date,
      };
      const feedbackData = new Feedback().checkfeedbackDataDto(checkdata);
      const checkResult = await this.feedBackRepository.checkFeedBack(
        feedbackData,
        queryRunner.manager
      );
      console.log("checkResult", checkResult);

      if (checkResult) {
        await queryRunner.commitTransaction();
        return checkResult.feedback;
      } else {
        // ChatGPT API 호출
        // const chatCompletion = await openai.chat.completions.create({
        //   messages: [
        //     {
        //       role: "system",
        //       content:
        //         "너는 영양사야. 식단 영양성분 구성을 알려주면 1일 권장 섭취량을 기준으로 식단을 평가 해줘",
        //     },
        //     {
        //       role: "assistant",
        //       content: "유저는 키가 160cm이고 몸무게가 50kg인 여자야",
        //     },
        //     {
        //       role: "user",
        //       content: question,
        //     },
        //   ],
        //   model: "gpt-3.5-turbo",
        // });

        // const outputText = chatCompletion.choices[0].message.content;
        const outputText = "test111";
        const data = {
          userId,
          question,
          questionType,
          feedback: outputText,
          feedbackDate: date,
        };
        console.log("data", data);
        const feedbackData = new Feedback().makefeedbackDataDto(data);
        await this.feedBackRepository.saveFeedBack(
          feedbackData,
          queryRunner.manager
        );
        await queryRunner.commitTransaction();
        return outputText;
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getFeedbackData(userId: string, date: Timestamp) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.feedBackRepository.getFeedbackData(
        userId,
        date,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return plainToInstance(GetFeedbackDataDto, result);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getFeedbackDetailData(userId: string, feedbackId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // health-info 테이블과 연결
      // const healthInfoResult = this.healthInfoRepository.getFeedbackDetailData(
      //   feedbackId,
      //   queryRunner.manager
      // );
      const feedbackResult =
        await this.feedBackRepository.getFeedbackDetailData(
          feedbackId,
          queryRunner.manager
        );
      await queryRunner.commitTransaction();
      return feedbackResult;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteFeedbackData(feedbackId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await this.feedBackRepository.deleteFeedbackData(
        feedbackId,
        queryRunner.manager
      );
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
