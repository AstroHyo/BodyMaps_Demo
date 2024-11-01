import { NiftiImageVolume } from "@cornerstonejs/nifti-volume-loader";
import {
  makeVolumeMetadata,
  modalityScaleNifti,
} from "@cornerstonejs/nifti-volume-loader/dist/esm/helpers";
import { rasToLps } from "@cornerstonejs/nifti-volume-loader/dist/esm/helpers/convert";
import * as NiftiReader from "nifti-reader-js";
import getUniqueID from "@/utils/uniqueID";
import { cache } from "@cornerstonejs/core";

export default function arrayBufferToNiftiImageVolume({
  buffer,
}: {
  buffer: ArrayBuffer;
}): NiftiImageVolume {
  console.log("loading buffer");

  if (NiftiReader.isCompressed(buffer)) {
    buffer = NiftiReader.decompress(buffer);
  }

  if (!NiftiReader.isNIFTI(buffer)) {
    throw new Error("Buffer is not a NIFTI file");
  }

  const header = NiftiReader.readHeader(buffer);
  if (!header) {
    throw new Error("Failed to read NIFTI header");
  }

  const image = NiftiReader.readImage(header, buffer);

  const { scalarData, pixelRepresentation } = modalityScaleNifti(header, image);

  const { orientation, origin, spacing } = rasToLps(header);

  const {
    volumeMetadata: metadata,
    dimensions,
    direction,
  } = makeVolumeMetadata(header, orientation, scalarData, pixelRepresentation);

  const volumeId = getUniqueID("volume");

  const controller = new AbortController();

  const volume = new NiftiImageVolume(
    {
      volumeId,
      metadata,
      dimensions,
      spacing,
      origin,
      direction,
      scalarData,
      sizeInBytes: scalarData.byteLength,
      imageIds: [],
    },
    {
      loadStatus: {
        loaded: false,
        loading: false,
        callbacks: [],
      },
      controller,
    }
  );

  cache
    .putVolumeLoadObject(volumeId, { promise: Promise.resolve(volume) })
    .catch((err) => {
      console.error(
        "failed to put volume load object for volumeId",
        volumeId,
        err
      );
    });

  return volume;
}
