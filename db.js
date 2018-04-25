const data = {
  newscasts: [
    {
      type: 'newscasts',
      title: 'Second Newscast for Station',
      relationships: {
        segments: [
          {
            type: 'segments',
            id: 1
          }
        ]
      },
      id: 1
    },
    {
      type: 'newscasts',
      title: 'First Completed Newscast for Station',
      relationships: {
        segments: [
          {
            type: 'segments',
            id: 2
          }
        ]
      },
      id: 2
    }
  ],
  packages: [
    {
      type: 'packages',
      durationInSeconds: 3,
      isOrdered: false,
      title: 'Some great title',
      relationships: {
        newscast: {
          type: 'newscasts',
          id: 1
        },
        peripherals: [],
        packageTemplate: { type: 'package-templates', id: 1 }
      },
      id: 1
    },
    {
      type: 'packages',
      durationInSeconds: 3,
      isOrdered: true,
      title: 'Some other title',
      relationships: {
        newscast: {
          type: 'newscasts',
          id: 1
        },
        peripherals: [],
        packageTemplate: { type: 'package-templates', id: 1 }
      },
      id: 2
    },
    {
      type: 'packages',
      durationInSeconds: 3,
      isOrdered: true,
      url: 'http://localhost:3000/files/soccer-kick-face.mp4',
      title: 'Completed Package',
      relationships: {
        newscast: {
          type: 'newscasts',
          id: 2
        },
        peripherals: [],
        packageTemplate: { type: 'package-templates', id: 1 }
      },
      id: 3
    }
  ],
  packagetemplates: [
    {
      id: 1,
      type: 'package-templates',
      name: 'Simple Template',
      peripheralDefinitions: [
        {
          name: 'Bottom Ticker',
          tags: [
            'wide',
            'peripheral'
          ],
          fillSetting: 'None'
        },
        {
          name: 'Left Column',
          tags: [
            'narrow',
            'index',
            'peripheral'
          ],
          fillSetting: 'Loop'
        }
      ]
    }
  ],
  segments: [
    {
      id: 1,
      type: 'segments',
      title: 'Some Kinda Segment Title',
      relationships: {
        segmentType: {
          type: 'segment-types',
          id: 1
        },
        shots: [
          { type: 'shots', id: 1 },
          { type: 'shots', id: 2 },
          { type: 'shots', id: 3 }
        ]
      }
    },
    {
      id: 2,
      type: 'segments',
      title: 'Some Segment Title',
      relationships: {
        segmentType: {
          type: 'segment-types',
          id: 1
        },
        shots: [
          { type: 'shots', id: 4 },
          { type: 'shots', id: 5 },
          { type: 'shots', id: 6 }
        ]
      }
    }
  ],
  segmenttypes: [
    {
      id: 1,
      type: 'segment-types',
      name: 'Story',
      hasAudio: false,
      isGlobal: false,
      relationships: {
        shotFilters: [
          {
            type: 'shot-layout-tags',
            id: 1
          }
        ]
      }
    }
  ],
  shotlayouts: [
    {
      id: 1,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Graphic over right shoulder because that is where it goes',
      thumbnailUrl: 'https://flixpress.com/tempImages/160.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template160.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'StudioVideo',
            label: 'Main Video',
            name: 'main_video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ClientImage',
            label: 'Graphic',
            name: 'graphic',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ShortText',
            label: 'Some Label',
            name: 'text_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'LongText',
            label: 'Narration',
            name: 'copy',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 2,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Basic Intro',
      thumbnailUrl: 'https://flixpress.com/tempImages/159.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template159.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'MultiSelect',
            label: 'Choose all that apply',
            name: 'choose_all_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['1', '3']
          },
          {
            inputType: 'SingleSelect',
            label: 'Choose one',
            name: 'choose_single_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['2']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 3,
      type: 'shot-layouts',
      requiresFilming: false,
      studioId: null,
      name: 'Client Video Focus',
      thumbnailUrl: 'https://flixpress.com/tempImages/154.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template154.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'ClientVideo',
            label: 'Video',
            name: 'video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 4,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Clone 1 - Graphic over right...',
      thumbnailUrl: 'https://flixpress.com/tempImages/160.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template160.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'StudioVideo',
            label: 'Main Video',
            name: 'main_video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ClientImage',
            label: 'Graphic',
            name: 'graphic',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ShortText',
            label: 'Some Label',
            name: 'text_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'LongText',
            label: 'Narration',
            name: 'copy',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 5,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Clone 1 - Basic Intro',
      thumbnailUrl: 'https://flixpress.com/tempImages/159.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template159.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'MultiSelect',
            label: 'Choose all that apply',
            name: 'choose_all_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['1', '3']
          },
          {
            inputType: 'SingleSelect',
            label: 'Choose one',
            name: 'choose_single_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['2']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 6,
      type: 'shot-layouts',
      requiresFilming: false,
      studioId: null,
      name: 'Clone 1 - Client Video Focus',
      thumbnailUrl: 'https://flixpress.com/tempImages/154.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template154.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'ClientVideo',
            label: 'Video',
            name: 'video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 7,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Clone 2 - Graphic over right...',
      thumbnailUrl: 'https://flixpress.com/tempImages/160.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template160.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'StudioVideo',
            label: 'Main Video',
            name: 'main_video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ClientImage',
            label: 'Graphic',
            name: 'graphic',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'ShortText',
            label: 'Some Label',
            name: 'text_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          },
          {
            inputType: 'LongText',
            label: 'Narration',
            name: 'copy',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 8,
      type: 'shot-layouts',
      requiresFilming: true,
      studioId: null,
      name: 'Clone 2 - Basic Intro',
      thumbnailUrl: 'https://flixpress.com/tempImages/159.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template159.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'MultiSelect',
            label: 'Choose all that apply',
            name: 'choose_all_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['1', '3']
          },
          {
            inputType: 'SingleSelect',
            label: 'Choose one',
            name: 'choose_single_1',
            counts: {
              minimum: 1,
              maximum: 1
            },
            selectOptions: [
              { label: 'one', value: '1' },
              { label: 'two', value: '2' },
              { label: 'three', value: '3' },
              { label: 'four', value: '4' }
            ],
            defaultValues: ['2']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
    {
      id: 9,
      type: 'shot-layouts',
      requiresFilming: false,
      studioId: null,
      name: 'Clone 2 - Client Video Focus',
      thumbnailUrl: 'https://flixpress.com/tempImages/154.jpg',
      videoUrl: 'https://mediarobotvideo.s3.amazonaws.com/sm/Template154.mp4',
      definition: {
        inputDefinitions: [
          {
            inputType: 'ClientVideo',
            label: 'Video',
            name: 'video',
            counts: {
              minimum: 1,
              maximum: 1
            },
            defaultValues: ['']
          }
        ],
        minimumDurationInSeconds: 3.0,
        maximumDurationInSeconds: 12.0,
        defaultDurationInSeconds: 5.0
      }
    },
  ],
  shotlayouttags: [
    {
      id: 1,
      type: 'shot-layout-tags',
      name: 'Story'
    }
  ],
  shots: [
    {
      id: 1,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 1 },
        segment: { type: 'segments', id: 1 }
      },
      shotData: {
        durationInSeconds: 7.27,
        inputValues: [
          {
            name: 'main_video',
            values: ['']
          },
          {
            name: 'graphic',
            values: ['1']
          },
          {
            name: 'text_1',
            values: ['some value']
          },
          {
            name: 'copy',
            values: ['This is the stuff that the anchor will speak. {% pause(3) %} And that is all.']
          }
        ]
      }
    },
    {
      id: 2,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 3 },
        segment: { type: 'segments', id: 1 }
      },
      shotData: {
        durationInSeconds: 5,
        inputValues: [
          {
            name: 'video',
            values: ['2']
          }
        ]
      }
    },
    {
      id: 3,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 2 },
        segment: { type: 'segments', id: 1 }
      },
      shotData: {
        durationInSeconds: 5,
        inputValues: [
          {
            name: 'choose_all_1',
            values: ['1', '3', '4']
          },
          {
            name: 'choose_single_1',
            values: ['2']
          }
        ]
      }
    },
    {
      id: 4,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 1 },
        segment: { type: 'segments', id: 2 }
      },
      shotData: {
        durationInSeconds: 10.27,
        inputValues: [
          {
            name: 'main_video',
            values: ['']
          },
          {
            name: 'graphic',
            values: ['1']
          },
          {
            name: 'text_1',
            values: ['some value']
          },
          {
            name: 'copy',
            values: ['Some interesting news out in the community of Harpersville today, where locals claim to have spotted a leprechaun thieving from residents of the twenty-one hundred block of State Street.']
          }
        ]
      }
    },
    {
      id: 5,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 1 },
        segment: { type: 'segments', id: 2 }
      },
      shotData: {
        durationInSeconds: 9.87,
        inputValues: [
          {
            name: 'main_video',
            values: ['']
          },
          {
            name: 'graphic',
            values: ['1']
          },
          {
            name: 'text_1',
            values: ['some value']
          },
          {
            name: 'copy',
            values: ['Winter weather is upon us for the whole month of January. Meteorologists say that this could be the coldest January we have seen since 1967. Be sure to bundle up out there!']
          }
        ]
      }
    },
    {
      id: 6,
      type: 'shots',
      relationships: {
        shotLayout: { type: 'shot-layouts', id: 1 },
        segment: { type: 'segments', id: 2 }
      },
      shotData: {
        durationInSeconds: 10,
        inputValues: [
          {
            name: 'main_video',
            values: ['']
          },
          {
            name: 'graphic',
            values: ['1']
          },
          {
            name: 'text_1',
            values: ['some value']
          },
          {
            name: 'copy',
            values: ['John Deere is set to announce new Healthcare options for all of its employees in the coming months. The new benefits will be a welcome addition to the already great care that John Deere employees already enjoy.']
          }
        ]
      }
    }
  ],
  media: [
    {
      id: 1,
      mediaFileId: 1,
      url: 'http://localhost:3000/files/toffee-at-home.jpg'
    },
    {
      id: 2,
      mediaFileId: 2,
      url: 'http://localhost:3000/files/soccer-kick-face.mp4'
    }
  ],
  globalsettings: [
    {
      id: 1,
      type: 'string',
      key: 'copy_seconds_per_character',
      value: '0.035'
    }
  ],

  templates: [
    {
      id: 1,
      type: 'templates',
      name: 'Just a package template',
      templateType: 'package',
      version: 'v1',
      previewUrl: 'http://localhost:3000/files/soccer-kick-face.mp4',
      imageUrl: 'http://localhost:3000/files/toffee-at-home.jpg',
      shareCompany: false,
      shareGlobal: false,
      editCompany: false,
      data: JSON.stringify({
        durationInSeconds: 3,
        title: 'Templated Package',
        newscast: {
          title: 'Templated Newscast for Station',
          segments: [
            {
              title: 'Templated Segment Title',
              segmentTypeId: 1,
              shots: [
                {
                  shotLayoutId: 1,
                  shotData: {
                    durationInSeconds: 10.27,
                    inputValues: [
                      {
                        name: 'main_video',
                        values: [''],
                      },
                      {
                        name: 'graphic',
                        values: ['1'],
                      },
                      {
                        name: 'text_1',
                        values: ['some value'],
                      },
                      {
                        name: 'copy',
                        values: ['Some interesting news out in the community of Harpersville today, where locals claim to have spotted a leprechaun thieving from residents of the twenty-one hundred block of State Street.'],
                      },
                    ],
                  },
                },
                {
                  shotLayoutId: 1,
                  shotData: {
                    durationInSeconds: 9.87,
                    inputValues: [
                      {
                        name: 'main_video',
                        values: [''],
                      },
                      {
                        name: 'graphic',
                        values: ['1'],
                      },
                      {
                        name: 'text_1',
                        values: ['some value'],
                      },
                      {
                        name: 'copy',
                        values: ['Winter weather is upon us for the whole month of January. Meteorologists say that this could be the coldest January we have seen since 1967. Be sure to bundle up out there!'],
                      },
                    ],
                  },
                },
                {
                  shotLayoutId: 1,
                  shotData: {
                    durationInSeconds: 10,
                    inputValues: [
                      {
                        name: 'main_video',
                        values: [''],
                      },
                      {
                        name: 'graphic',
                        values: ['1'],
                      },
                      {
                        name: 'text_1',
                        values: ['some value'],
                      },
                      {
                        name: 'copy',
                        values: ['John Deere is set to announce new Healthcare options for all of its employees in the coming months. The new benefits will be a welcome addition to the already great care that John Deere employees already enjoy.'],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        packageTemplateId: 1,
      }),
    },
    {
      id: 2,
      type: 'templates',
      name: 'Just a newscast template',
      templateType: 'newscast',
      version: 'v1',
      previewUrl: 'http://localhost:3000/files/soccer-kick-face.mp4',
      imageUrl: 'http://localhost:3000/files/toffee-at-home.jpg',
      shareCompany: false,
      shareGlobal: false,
      editCompany: false,
      data: JSON.stringify({
        title: 'Templated Newscast for Station',
        segments: [
          {
            title: 'Templated Segment Title',
            segmentTypeId: 1,
            shots: [
              {
                shotLayoutId: 1,
                shotData: {
                  durationInSeconds: 10.27,
                  inputValues: [
                    {
                      name: 'main_video',
                      values: [''],
                    },
                    {
                      name: 'graphic',
                      values: ['1'],
                    },
                    {
                      name: 'text_1',
                      values: ['some value'],
                    },
                    {
                      name: 'copy',
                      values: ['Some interesting news out in the community of Harpersville today, where locals claim to have spotted a leprechaun thieving from residents of the twenty-one hundred block of State Street.'],
                    },
                  ],
                },
              },
              {
                shotLayoutId: 1,
                shotData: {
                  durationInSeconds: 9.87,
                  inputValues: [
                    {
                      name: 'main_video',
                      values: [''],
                    },
                    {
                      name: 'graphic',
                      values: ['1'],
                    },
                    {
                      name: 'text_1',
                      values: ['some value'],
                    },
                    {
                      name: 'copy',
                      values: ['Winter weather is upon us for the whole month of January. Meteorologists say that this could be the coldest January we have seen since 1967. Be sure to bundle up out there!'],
                    },
                  ],
                },
              },
              {
                shotLayoutId: 1,
                shotData: {
                  durationInSeconds: 10,
                  inputValues: [
                    {
                      name: 'main_video',
                      values: [''],
                    },
                    {
                      name: 'graphic',
                      values: ['1'],
                    },
                    {
                      name: 'text_1',
                      values: ['some value'],
                    },
                    {
                      name: 'copy',
                      values: ['John Deere is set to announce new Healthcare options for all of its employees in the coming months. The new benefits will be a welcome addition to the already great care that John Deere employees already enjoy.'],
                    },
                  ],
                },
              },
            ],
          },
        ],
      }),
    },
    {
      id: 3,
      type: 'templates',
      name: 'Just a segment template',
      templateType: 'segment',
      version: 'v1',
      previewUrl: 'http://localhost:3000/files/soccer-kick-face.mp4',
      imageUrl: 'http://localhost:3000/files/toffee-at-home.jpg',
      shareCompany: false,
      shareGlobal: false,
      editCompany: false,
      data: JSON.stringify({
        title: 'Templated Segment Title',
        segmentTypeId: 1,
        shots: [
          {
            shotLayoutId: 1,
            shotData: {
              durationInSeconds: 10.27,
              inputValues: [
                {
                  name: 'main_video',
                  values: [''],
                },
                {
                  name: 'graphic',
                  values: ['1'],
                },
                {
                  name: 'text_1',
                  values: ['some value'],
                },
                {
                  name: 'copy',
                  values: ['Some interesting news out in the community of Harpersville today, where locals claim to have spotted a leprechaun thieving from residents of the twenty-one hundred block of State Street.'],
                },
              ],
            },
          },
          {
            shotLayoutId: 1,
            shotData: {
              durationInSeconds: 9.87,
              inputValues: [
                {
                  name: 'main_video',
                  values: [''],
                },
                {
                  name: 'graphic',
                  values: ['1'],
                },
                {
                  name: 'text_1',
                  values: ['some value'],
                },
                {
                  name: 'copy',
                  values: ['Winter weather is upon us for the whole month of January. Meteorologists say that this could be the coldest January we have seen since 1967. Be sure to bundle up out there!'],
                },
              ],
            },
          },
          {
            shotLayoutId: 1,
            shotData: {
              durationInSeconds: 10,
              inputValues: [
                {
                  name: 'main_video',
                  values: [''],
                },
                {
                  name: 'graphic',
                  values: ['1'],
                },
                {
                  name: 'text_1',
                  values: ['some value'],
                },
                {
                  name: 'copy',
                  values: ['John Deere is set to announce new Healthcare options for all of its employees in the coming months. The new benefits will be a welcome addition to the already great care that John Deere employees already enjoy.'],
                },
              ],
            },
          },
        ],
      }),
    },
    {
      id: 4,
      type: 'templates',
      name: 'Just a shot template',
      templateType: 'shot',
      version: 'v1',
      previewUrl: 'http://localhost:3000/files/soccer-kick-face.mp4',
      imageUrl: 'http://localhost:3000/files/toffee-at-home.jpg',
      shareCompany: false,
      shareGlobal: false,
      editCompany: false,
      data: JSON.stringify({
        shotLayoutId: 1,
        shotData: {
          durationInSeconds: 10.27,
          inputValues: [
            {
              name: 'main_video',
              values: [''],
            },
            {
              name: 'graphic',
              values: ['1'],
            },
            {
              name: 'text_1',
              values: ['some value'],
            },
            {
              name: 'copy',
              values: ['Some interesting news out in the community of Harpersville today, where locals claim to have spotted a leprechaun thieving from residents of the twenty-one hundred block of State Street.'],
            },
          ],
        },
      }),
    },
  ],
};

module.exports = data;

