/**
 * CloudFlare fence
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * CAVI, Aarhus University
 * 
 * @label CloudFlare
 * @description Detects the CloudFlare bot detector and waits for it
 */
/* exported from gatherer id 16 rev 5 on Sun, 30 Mar 2025 12:19:39 +0200 */
import FenceGatherer from '../Fences/FenceGatherer.js';
export default class CloudflareFence extends FenceGatherer {
    constructor() {
        super("script[src^='/cdn-cgi/challenge-platform/']", "CloudFlareFence");
    }
}
