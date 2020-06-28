// @flow
const React = require('react');
const { jsx, css } = require('@emotion/core');
const { configure, shallow: enzymeShallow } = require('enzyme');
const ReactShallowRenderer = require('react-test-renderer/shallow');
const Adapter = require('enzyme-adapter-react-16');
const enzymeToJson = require('enzyme-to-json/serializer');
const emotionSerializer = require('jest-emotion');
const snapshotDiff = require('../src/index');

configure({ adapter: new Adapter() });
const reactShallow = new ReactShallowRenderer();

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, enzymeToJson]);

type Props = {
  test: string,
};

const Component = ({ value }) => <div>I have value {value}</div>;

const NestedComponent = (props: Props) => (
  <div className={props.className}>
    <span>Hello World - {props.test}</span>
    <Component value={1234} />
  </div>
);

describe('default rendered components', () => {
  test('diffs components', () => {
    expect(
      snapshotDiff(
        <NestedComponent test="say" />,
        <NestedComponent test="my name" />
      )
    ).toMatchSnapshot();
  });

  test('can use contextLines', () => {
    expect(
      snapshotDiff(
        <NestedComponent test="say" />,
        <NestedComponent test="my name" />,
        {
          contextLines: 0,
        }
      )
    ).toMatchSnapshot();
  });
});

describe('enzyme shallow rendered components', () => {
  test('diffs components', () => {
    expect(
      snapshotDiff(
        enzymeShallow(<NestedComponent test="say" />),
        enzymeShallow(<NestedComponent test="my name" />)
      )
    ).toMatchSnapshot();
  });

  test('can use contextLines', () => {
    expect(
      snapshotDiff(
        enzymeShallow(<NestedComponent test="say" />),
        enzymeShallow(<NestedComponent test="my name" />),
        {
          contextLines: 0,
        }
      )
    ).toMatchSnapshot();
  });
});

describe('react test-renderer shallow rendered components', () => {
  test('diffs components', () => {
    expect(
      snapshotDiff(
        reactShallow.render(<NestedComponent test="say" />),
        reactShallow.render(<NestedComponent test="my name" />)
      )
    ).toMatchSnapshot();
  });

  test('can use contextLines', () => {
    expect(
      snapshotDiff(
        reactShallow.render(<NestedComponent test="say" />),
        reactShallow.render(<NestedComponent test="my name" />),
        {
          contextLines: 0,
        }
      )
    ).toMatchSnapshot();
  });
});

describe('values which are not components', () => {
  test('diffs objects', () => {
    expect(
      snapshotDiff(
        { foo: 'bar', hello: 'world', testing: 123 },
        { foo: 'bar', hello: 'there', testing: 123 }
      )
    ).toMatchSnapshot();
  });

  test('can use contextLines', () => {
    expect(
      snapshotDiff(
        { foo: 'bar', hello: 'world', testing: 123 },
        { foo: 'bar', hello: 'there', testing: 123 },
        {
          contextLines: 0,
        }
      )
    ).toMatchSnapshot();
  });
});

describe('components using CSS-in-JS', () => {
  beforeEach(() => {
    snapshotDiff.reactSerializer.setSerializers([
      emotionSerializer,
      ...snapshotDiff.reactSerializer.defaultSerializers,
    ]);
  });

  test('diffs components', () => {
    expect(
      snapshotDiff(
        jsx(NestedComponent, {
          css: css`
            color: green;
          `,
          test: 'say',
        }),
        jsx(NestedComponent, {
          css: css`
            color: red;
          `,
          test: 'my name',
        })
      )
    ).toMatchSnapshot();
  });

  test('can use contextLines', () => {
    expect(
      snapshotDiff(
        jsx(NestedComponent, {
          css: css`
            color: green;
          `,
          test: 'say',
        }),
        jsx(NestedComponent, {
          css: css`
            color: red;
          `,
          test: 'my name',
        }),
        {
          contextLines: 0,
        }
      )
    ).toMatchSnapshot();
  });
});
