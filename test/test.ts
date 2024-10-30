import { ChannelCredentials } from '@grpc/grpc-js';
import fs from 'fs/promises';
import path from 'path';

import { MaterialClient, ThemeReply } from '../src/proto/material.js';

describe('Main cases', () => {
  const client = new MaterialClient(
    '0.0.0.0:49300',
    ChannelCredentials.createInsecure(),
  );

  it('The server is working correctly', async () => {
    const { promise, resolve, reject } = Promise.withResolvers<ThemeReply>();

    client.test({}, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    const result = await promise;

    expect(result.source).toBe(4291305782);
  });

  it('The function generateFromSourceColor is working correctly', async () => {
    const color = 4291305300;

    const { promise, resolve, reject } = Promise.withResolvers<ThemeReply>();

    client.generateFromSourceColor({ color }, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    const result = await promise;

    expect(result.source).toBe(color);
    expect(result.style).toBeDefined();
  });

  it('The function generateFromImageBuffer is working correctly', async () => {
    const filePath = path.join('temp', 'temp.jpg');
    const data = await fs.readFile(filePath);
    const uint8Array = new Uint8Array(data);

    const { promise, resolve, reject } = Promise.withResolvers<ThemeReply>();

    client.generateFromImageBuffer({ buffer: uint8Array }, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result);
    });

    const result = await promise;

    expect(result.source).toBe(4291305782);
    expect(result.style).toBeDefined();
  });
});
