/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

const ClientExtensionsTransform = require('../transforms/ClientExtensionsTransform');
const FilterDirectivesTransform = require('../transforms/FilterDirectivesTransform');
const FlattenTransform = require('../transforms/FlattenTransform');
const InlineFragmentsTransform = require('../transforms/InlineFragmentsTransform');
const SkipClientExtensionsTransform = require('../transforms/SkipClientExtensionsTransform');
const SkipRedundantNodesTransform = require('../transforms/SkipRedundantNodesTransform');
const SkipUnreachableNodeTransform = require('../transforms/SkipUnreachableNodeTransform');

import type CompilerContext from './GraphQLCompilerContext';

export type IRTransform = CompilerContext => CompilerContext;

// Transforms applied to fragments used for reading data from a store
const FRAGMENT_TRANSFORMS: Array<IRTransform> = [
  ClientExtensionsTransform.transform,
  FlattenTransform.transformWithOptions({flattenAbstractTypes: true}),
  SkipRedundantNodesTransform.transform,
];

// Transforms applied to queries/mutations/subscriptions that are used for
// fetching data from the server and parsing those responses.
const QUERY_TRANSFORMS: Array<IRTransform> = [
  ClientExtensionsTransform.transform,
  SkipClientExtensionsTransform.transform,
  SkipUnreachableNodeTransform.transform,
];

// Transforms applied to the code used to process a query response.
const CODEGEN_TRANSFORMS: Array<IRTransform> = [
  ClientExtensionsTransform.transform,
  InlineFragmentsTransform.transform,
  FlattenTransform.transformWithOptions({
    flattenAbstractTypes: true,
  }),
  SkipRedundantNodesTransform.transform,
  FilterDirectivesTransform.transform,
];

module.exports = {
  codegenTransforms: CODEGEN_TRANSFORMS,
  fragmentTransforms: FRAGMENT_TRANSFORMS,
  queryTransforms: QUERY_TRANSFORMS,
};
