import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = 'watchl-schedule';

type ScheduleMedia = {
  userId: string;
  time: string;
  mediaId: string;
  location: string;
  details: string;
  invites: string[];
};

export const saveSchedule = async (scheduleMedia: ScheduleMedia) => {
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        userId: scheduleMedia.userId,
        time: scheduleMedia.time,
        mediaId: scheduleMedia.mediaId,
        location: scheduleMedia.location,
        details: scheduleMedia.details,
        invites: scheduleMedia.invites,
      },
    })
  );
};
