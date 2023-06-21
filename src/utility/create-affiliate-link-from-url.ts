import {
  DeeplinkResponse,
  CreateAffiliateLinkOptions,
  ShortenedAdvertiser,
} from "../types";

import flexoffers from "../";

export const createAffiliateLinkFromUrl = async (
  url: string,
  options?: CreateAffiliateLinkOptions
): Promise<DeeplinkResponse | null> => {
  const domain = flexoffers.helpers.getDomainFromUrl(url);

  const getAllApprovedAdvertisers = async (): Promise<
    ShortenedAdvertiser[] | null
  > => {
    try {
      const advertisers = await flexoffers.advertisers.getAdvertisers({
        Page: 1,
        pageSize: 5000,
        ProgramStatus: "Approved",
        ApplicationStatus: "Approved",
      });

      if (
        !advertisers ||
        !advertisers.results ||
        advertisers.results.length === 0
      ) {
        throw new Error("No advertisers found");
      }

      return advertisers.results.map(
        ({ id, domainUrl, name, deeplinkURL }) => ({
          id,
          deeplinkURL,
          domainUrl,
          name,
        })
      );
    } catch (error) {
      console.error("Failed to retrieve advertisers:", error);
      return null;
    }
  };

  const allApprovedAdvertisers = await getAllApprovedAdvertisers();

  if (!allApprovedAdvertisers) {
    return null;
  }

  const advertiser = allApprovedAdvertisers.find(
    (advertiser) =>
      advertiser.domainUrl &&
      flexoffers.helpers.getDomainFromUrl(advertiser.domainUrl) === domain
  );

  if (!advertiser || !advertiser.id) {
    console.warn("Advertiser not found");
    return null;
  }

  try {
    const deepLinkOptions = {
      AdvertiserId: advertiser.id,
      URL: url,
      ...options,
    };

    const affiliateLink = await flexoffers.actions.createDeepLink(
      deepLinkOptions
    );

    return affiliateLink;
  } catch (error) {
    console.error("Failed to create deep link:", error);
    return null;
  }
};

// const options: CreateAffiliateLinkOptions = {
//   fobs: "mrjuan",
//   fobs2: "discordgroup-private",
// };

// createAffiliateLinkFromUrl("https://sodastream.com/pages/co2-gas-cylinders", options)
//   .then((link) => {
//     console.log("Affiliate Link", link); // https://track.flexlinkspro.com/g.ashx?foid=1.42748&trid=1324269.165&foc=17&fot=9999&fos=1&URL=https%3A%2F%2Fsodastream.com%2Fpages%2Fco2-gas-cylinders&fobs2=discordgroup-private&fobs=mrjuan
//   })
//   .catch((err) => {
//     console.error(err);
//   });




import flexoffers from 'flexoffers'

flexoffers.init('YOUR_API_KEY')
createAffiliateLinkFromUrl("https://www.lush.com/uk/en/p/seanik-shampoo-bar-2021")

