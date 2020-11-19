/** @jsx jsx */

import log from 'electron-log';
import { css, jsx } from '@emotion/core';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import { ControlGroup, InputGroup, Tag, TextArea } from '@blueprintjs/core';


const DoubleLanguagePropertyDetailView: React.FC<{
  title: string
  values: { [langID: string]: string }
  ValueWidget: React.FC<{ value: string }>
}> = function ({ title, values, ValueWidget }) {
  return <PropertyDetailView title={title}>
    <ControlGroup fill>
      {Object.entries(values).map(([langID, value]) =>
        <div>
          <Tag minimal css={css`margin-bottom: .25rem;`}>{langID}</Tag>
          <ValueWidget value={value} />
        </div>
      )}
    </ControlGroup>
  </PropertyDetailView>
}


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
    listItemView: ({ itemData, className }) =>
      <span className={className}>
        <code>{itemData.identifier}</code>
        &emsp;
        {itemData.title?.eng || '—'}
      </span>,
    detailView: ({ itemData, className }) => {
      const {
        identifier,
        title,
        description,
      } = itemData;
      return (
        <div className={className}>
          <PropertyDetailView title="Identifier">
            <p>{identifier}</p>
          </PropertyDetailView>
          <DoubleLanguagePropertyDetailView
            title="Title"
            values={title}
            ValueWidget={({ value }) => <InputGroup readOnly value={value} />}
          />
          <DoubleLanguagePropertyDetailView
            title="Description"
            values={description}
            ValueWidget={({ value }) => <TextArea css={css`width: 100%; height: 100%;`} readOnly value={value} />}
          />
        </div>
      );
    },
    editView: () => <span>TBD</span>,
  },
};


export default function () {
  return <RegistryView itemClassConfiguration={{ code }} />
};
