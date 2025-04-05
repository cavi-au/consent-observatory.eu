/**
 * CaptchaDeliveryFence
 * 
 * Copyright (c) 2023 Rolf Bagge,
 * CAVI, Aarhus University
 * 
 * @label Captcha Delivery
 * @description Detects the CaptchaDelivery bot detector
 */
/* exported from gatherer id 17 rev 5 on Sun, 30 Mar 2025 12:19:39 +0200 */
import FenceGatherer from '../Fences/FenceGatherer.js';
export default class CaptchaDeliveryFence extends FenceGatherer {
    constructor() {
        super("script[src^='https://ct.captcha-delivery.com/']", "CaptchaDeliveryFence");
    }
}
