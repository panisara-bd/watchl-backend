openapi: 3.0.0
info:
  title: WatchL API
  version: 1.0.0
paths:
  /media/{mediaId}:
    get:
      summary: Get Media
      x-amazon-apigateway-request-validator: params-only
      parameters:
        - name: mediaId
          in: path
          required: true
          description: The media id
          schema:
            type: string
            minimum: 1
      responses:
        '200':
          description: The media object
          content:
            application/json:
              schema:
                '$ref': '#/components/schemas/MediaObject'
      x-amazon-apigateway-integration:
        uri: '${get_media_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
  /media/search:
    get:
      summary: Search media
      x-amazon-apigateway-request-validator: params-only
      parameters:
        - name: query
          in: query
          required: true
          description: The search query
          schema:
            type: string
            minimum: 1
      responses:
        '200':
          description: A list of matching media objects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MediaSearchObject'
      x-amazon-apigateway-integration:
        uri: '${search_media_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
  /schedule:
    post:
      summary: Add media to schedule
      x-amazon-apigateway-request-validator: body-only
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/MediaScheduleObject'
      responses:
        '201':
          description: A media schedule is created
      x-amazon-apigateway-integration:
        uri: '${schedule_media_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
    get:
      summary: Get the schedule
      responses:
        '200':
          description: Get schedule from database successful
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: '${get_schedule_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
  /schedule/{time}:
    delete:
      summary: Delete media from the schedule
      x-amazon-apigateway-request-validator: params-only
      parameters:
        - name: time
          in: path
          required: true
          description: The time
          schema:
            type: string
            minimum: 1
      responses:
        '204':
          description: Deleted
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: '${delete_media_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
    get:
      summary: Get the media from schedule
      x-amazon-apigateway-request-validator: params-only
      parameters:
        - name: time
          in: path
          required: true
          description: Get medie by time
          schema:
            type: string
            minimum: 1
      responses:
        '204':
          description: Get schedule from database successful
        '401':
          description: Unauthorized
      x-amazon-apigateway-integration:
        uri: '${get_scheduled_media_lambda_arn}'
        passthroughBehavior: when_no_match
        httpMethod: POST
        type: aws_proxy
components:
  schemas:
    MediaImage:
      type: object
      properties:
        height:
          type: integer
        url:
          type: string
        width:
          type: integer
    MediaObject:
      type: object
      properties:
        id:
          type: string
        image:
          type:
            $ref: '#/components/schemas/MediaImage'
        runningTimeInMinutes:
          type: integer
        nextEpisode:
          type: string
        numberOfEpisodes:
          type: integer
        title:
          type: string
        titleType:
          type: string
        year:
          type: integer
        rating:
          type: integer
        genres:
          type: array
          items:
            type: string
        summary:
          type: string
    MediaSearchObject:
      type: object
      properties:
        id:
          type: string
        image:
          type:
            $ref: '#/components/schemas/MediaImage'
        title:
          type: string
        titleType:
          type: string
        year:
          type: integer
    MediaScheduleObject:
      type: object
      required:
        - mediaId
        - time
      properties:
        mediaId:
          type: string
        time:
         type: string
        location:
          type: string
        details:
          type: string
        invites:
          type: array
          items:
            type: string
x-amazon-apigateway-request-validators:
  all:
    validateRequestBody: true
    validateRequestParameters: true
  params-only:
    validateRequestBody: false
    validateRequestParameters: true
  body-only:
    validateRequestBody: true
    validateRequestParameters: false