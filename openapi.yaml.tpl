openapi: 3.0.0
info:
  title: WatchL API
  version: 1.0.0
paths:
  /media/{mediaId}:
    get:
      summary: Get Media
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
    post:
      summary: Search media
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
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