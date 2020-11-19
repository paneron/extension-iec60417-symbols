/** @jsx jsx */

import log from 'electron-log';
import { jsx } from '@emotion/core';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';


interface SymbolData {
  identifier: string
  title: {
    eng: string
    fre: string
  }
  attachments: {
    [attachmentID: string]: {
      data: string // base64
      mime: string
    }
  }
  authors: string[]
  description: {
    eng: string
    fre: string
  }
  fieldOfApplication: string[]
  form: {
    arrows: string
    arrowsDouble: string | null // TODO
    barrels: string
    circles: string
    lines: string
    objectsOrdinaryUsers: string | null
    objectsTechnicalUsers: string | null
    objectsStandardized: string | null
    recognizableObjects: string | null
    polygons: string
    rectangles: string
    shields: string
    squares: string
    triangles: string
  }
  function: string[]
  geometricForm: string[]
  keywords: {
    eng: string[]
    fre: string[]
  }
  notes: {
    eng: string
    fre: string
  }
  prefix: string
  preview: string
  productArea: {
    eng: string
    fre: string
  }
  relevantPublications: string[]
  relevantTCs: string[]
  remarks: {
    eng: string
    fre: string
  }
  replacing: string[]
  std: string
}


const code: ItemClassConfiguration<SymbolData> = {
  meta: {
    title: "Symbol",
    description: "Symbol",
    id: 'symbols',
    alternativeNames: [],
  },
  defaults: {
    replacing: [],
    relevantPublications: [],
    relevantTCs: [],
    geometricForm: [],
    function: [],
    fieldOfApplication: [],
    authors: [],
    notes: {
      eng: '',
      fre: '',
    },
    remarks: {
      eng: '',
      fre: '',
    },
    productArea: {
      eng: '',
      fre: '',
    },
    description: {
      eng: '',
      fre: '',
    },
    keywords: {
      eng: [],
      fre: [],
    },
    attachments: {},
  },
  itemSorter: (p1, p2) => (p1.identifier || '').localeCompare(p2.identifier || ''),
  sanitizePayload: async (p) => p,
  validatePayload: async () => true,

  views: {
    listItemView: ({ itemData }) => <span>{itemData.identifier} {itemData.title.eng}</span>,
    detailView: ({ itemData }) => {
      return (
        <p>{itemData.title.eng}</p>
      );
    },
    editView: () => <span>TBD</span>,
  },
};


export default function () {
  return <RegistryView itemClassConfiguration={{ code }} />
};
