import dotenv from 'dotenv';
dotenv.config();

import grpc from '@grpc/grpc-js';
import { Status } from '@grpc/grpc-js/build/src/constants.js';
import path from 'path';
import { fileURLToPath } from 'url';

import { COLOR_VARIABLES } from './constants.js';
import {
  themeFromImage,
  themeFromSourceColor,
} from './material-color-utilities.js';
import { MaterialServer, MaterialService } from './proto/material.js';
import { convertSchemesToCss } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const implementation: MaterialServer = {
  async test(_call, callback) {
    try {
      const theme = await themeFromImage(
        path.join(__dirname, '..', 'temp', 'temp.jpg'),
      );

      callback(null, {
        source: theme.source,
        style: convertSchemesToCss(theme.schemes),
      });
    } catch (error) {
      console.error(error);

      callback({
        code: Status.INTERNAL,
        message: 'INTERNAL',
      });
    }
  },

  async generateFromSourceColor(call, callback) {
    const source = call.request.color;

    if (source < COLOR_VARIABLES.MIN_HEX || source > COLOR_VARIABLES.MAX_HEX) {
      const message = `The source color (${source}) must be a positive integer greater than ${COLOR_VARIABLES.MIN_HEX} and less than or equal to ${COLOR_VARIABLES.MAX_HEX}.`;

      console.warn(message);

      callback({
        code: Status.INVALID_ARGUMENT,
        message,
      });
      return;
    }

    try {
      const theme = await themeFromSourceColor(source);

      callback(null, {
        source: theme.source,
        style: convertSchemesToCss(theme.schemes),
      });
    } catch (error) {
      console.error(error);

      callback({
        code: Status.INTERNAL,
        message: 'INTERNAL',
      });
    }
  },

  async generateFromImageBuffer(call, callback) {
    const buffer = Buffer.from(call.request.buffer);

    try {
      const theme = await themeFromImage(buffer);

      callback(null, {
        source: theme.source,
        style: convertSchemesToCss(theme.schemes),
      });
    } catch (error) {
      console.error(error);

      callback({
        code: Status.INTERNAL,
        message: 'INTERNAL',
      });
    }
  },
};

export async function main() {
  const server = new grpc.Server();
  server.addService(MaterialService, implementation);

  const { promise, resolve, reject } = Promise.withResolvers<void>();

  server.bindAsync(
    `0.0.0.0:${process.env.PORT}`,
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        reject(error);
        return;
      }

      console.info(`The service is running on gRPC at localhost:${port}`);
      resolve(undefined);
    },
  );

  return promise;
}

main();
