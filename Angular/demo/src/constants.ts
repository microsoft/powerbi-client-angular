// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

// Success Image element
const successElement = document.createElement('img');
successElement.className = 'status-img';
successElement.src = '/assets/success.svg';

// Error Image element
const errorElement = document.createElement('img');
errorElement.className = 'status-img';
errorElement.src = '/assets/error.svg';

// Endpoint to get report config
const reportUrl = 'https://aka.ms/CaptureViewsReportEmbedConfig';

const errorClass = 'error';
const successClass = 'success';

export { errorClass, errorElement, reportUrl, successClass, successElement };
