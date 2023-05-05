import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true }});

const tableName = 'watchl-schedule';

type Media = {
  id: string,
  image: {
    height: number,
    url: string,
    width: number,
  },
  runningTimeInMinutes: number,
  nextEpisode?: string,
  numberOfEpisodes?: string,
  title: string,
  titleType: string,
  year: string,
  rating: string,
  genres: string,
  summary: string,
}

type ScheduleMedia = {
  userId: string;
  mediaId: string;
  media: Media;
  time: string;
  location?: string;
  details?: string;
  invites?: string[];
};

export const saveSchedule = async (scheduleMedia: ScheduleMedia) => {
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: scheduleMedia,
    })
  );
};

export const deleteSchedule = async (key: { userId: string; time: string }) => {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: key,
    })
  );
};

export const getSchedule = async (userId: string) => {
  await dynamo.send(
    new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: '#userId = :userId',
      ExpressionAttributeNames: { userId: 'userId' },
      ExpressionAttributeValues: {
        userId,
      },
    })
  );
};

export const getScheduledMedia = async (key: {
  userId: string;
  time: string;
}) => {
  await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: key,
    })
  );
};
