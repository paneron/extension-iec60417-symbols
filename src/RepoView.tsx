/** @jsx jsx */

import log from 'electron-log';
import { css, jsx } from '@emotion/core';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import { ControlGroup, InputGroup, NonIdealState, Tag, TagInput, TextArea } from '@blueprintjs/core';


const DoubleLanguagePropertyDetailView: React.FC<{
  values: { [langID: string]: any }
  ValueWidget: React.FC<{ value: any }>
}> = function ({ values, ValueWidget }) {
  return (
    <ControlGroup fill>
      {Object.entries(values).map(([langID, value]) =>
        <div css={css`width: 50%;`}>
          <Tag minimal css={css`margin-bottom: .25rem;`}>{langID}</Tag>
          <ValueWidget value={value} />
        </div>
      )}
    </ControlGroup>
  )
}


const MaybeTextarea: React.FC<{ value: any }> = function ({ value }) {
  if (value || (value as string[]).length > 0) {
    return <TextArea css={css`width: 100%; height: 100%;`} readOnly value={value} />;
  } else {
    return <span css={css`padding: 0 1rem;`}>—</span>;
  }
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
        authors,
        keywords,
        replacing,
        relevantTCs,
        fieldOfApplication,
        relevantPublications,
        productArea,
        notes,
        remarks,
      } = itemData;
      if (identifier && title && description && keywords) {
        return (
          <div className={className}>
            <PropertyDetailView title="Identifier">
              {identifier}
            </PropertyDetailView>

            <PropertyDetailView title="Title">
              <DoubleLanguagePropertyDetailView
                values={title}
                ValueWidget={({ value }) => <InputGroup readOnly value={value} />}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Product area">
              <DoubleLanguagePropertyDetailView
                values={productArea}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Description">
              <DoubleLanguagePropertyDetailView
                values={description}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Notes">
              <DoubleLanguagePropertyDetailView
                values={notes}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Remarks">
              <DoubleLanguagePropertyDetailView
                values={remarks}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Authors">
              <TagInput disabled leftIcon="user" values={authors} />
            </PropertyDetailView>
            <PropertyDetailView title="Function">
              <TagInput disabled leftIcon="locate" values={itemData.function} />
            </PropertyDetailView>
            <PropertyDetailView title="Field of application">
              <TagInput disabled leftIcon="search-around" values={fieldOfApplication} />
            </PropertyDetailView>
            <PropertyDetailView title="Replacing">
              <TagInput disabled leftIcon="flows" values={replacing} />
            </PropertyDetailView>
            <PropertyDetailView title="Relevant TCs">
              <TagInput disabled leftIcon="people" values={relevantTCs} />
            </PropertyDetailView>
            <PropertyDetailView title="Relevant publications">
              <TagInput disabled leftIcon="book" values={relevantPublications} />
            </PropertyDetailView>

            <PropertyDetailView title="Keywords">
              <DoubleLanguagePropertyDetailView
                values={keywords}
                ValueWidget={({ value }) => <TagInput disabled leftIcon="tag" values={value} />}
              />
            </PropertyDetailView>
          </div>
        );
      } else {
        return <NonIdealState icon="heart-broken" title="Error displaying item" />;
      }
    },
    editView: () => <span>TBD</span>,
  },
};


export default function () {
  return <RegistryView itemClassConfiguration={{ code }} />
};
