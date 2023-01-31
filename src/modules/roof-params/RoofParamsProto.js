/** Custom modules */
import I18N from '../../global/i18n/I18N';


export default function RoofParamsProto(){}


RoofParamsProto.prototype.get = function(lang){
    const i18n = new I18N(lang);

    return  {
        /** PENT */
        pent: {
            noangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/pent/plane-top.svg').default,
                    sizes: {
                        slopeLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '61%'
                            }
                        },
                        ridgeLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '63%',
                                left: '5%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/pent/plane-side.svg').default,
                    sizes: {
                        roofHeight: {
                            val: 3,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '28%',
                                right: '-10%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '19%',
                                right: '-10%'
                            }
                        },
                        roofSkirt: {
                            val: 0.2,
                            min: 0,
                            max: 1,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-5%',
                                left: '36%'
                            }
                        }
                    }
                }
            },
    
            withangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/pent/plane-top.svg').default,
                    sizes: {
                        slopeLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '61%'
                            }
                        },
                        ridgeLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '63%',
                                left: '5%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/pent/plane-side-angle.svg').default,
                    sizes: {
                        slopeAngle: {
                            val: 35,
                            min: 14.99,
                            max: 85,
                            unit: i18n.tr('glob.unit-degrees'),
                            pos: {
                                top: '43%',
                                left: '33%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '18%',
                                right: '-13%'
                            }
                        },
                        roofSkirt: {
                            val: 0.2,
                            min: 0,
                            max: 1,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-5%',
                                left: '36%'
                            }
                        }
                    }
                }
            }
        },
    
        /** GABLE */
        gable: {
            noangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/gable/plane-top.svg').default,
                    sizes: {
                        slopeLeftLength: {
                            val: 5.5,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '37%'
                            }
                        },
                        slopeRightLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '76%'
                            }
                        },
                        ridgeLength: {
                            val: 10,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '62%',
                                left: '7%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/gable/plane-side.svg').default,
                    sizes: {
                        slopeLeftHeight: {
                            val: 2,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '17%',
                                left: '6%'
                            }
                        },
                        slopeRightHeight: {
                            val: 3,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '24%',
                                right: '-8%'
                            }
                        },
                        wallsLeftHeight: {
                            val: 3,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '56%',
                                left: '6%'
                            }
                        },
                        wallsRightHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '63%',
                                right: '-8%'
                            }
                        },
                        roofSkirt: {
                            val: 0.2,
                            min: 0,
                            max: 1,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-6%',
                                left: '34%'
                            }
                        }
                    }
                },
            },
    
            withangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/gable/plane-top.svg').default,
                    sizes: {
                        slopeLeftLength: {
                            val: 5.5,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '37%'
                            }
                        },
                        slopeRightLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '7%',
                                left: '76%'
                            }
                        },
                        ridgeLength: {
                            val: 10,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '62%',
                                left: '7%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/gable/plane-side-angle.svg').default,
                    sizes: {
                        slopeLeftAngle: {
                            val: 19,
                            min: 14.99,
                            max: 85,
                            unit: i18n.tr('glob.unit-degrees'),
                            pos: {
                                top: '26%',
                                left: '43%'
                            }
                        },
                        slopeRightAngle: {
                            val: 21.7,
                            min: 14.99,
                            max: 85,
                            unit: i18n.tr('glob.unit-degrees'),
                            pos: {
                                top: '48%',
                                right: '36%'
                            }
                        },
                        wallsLeftHeight: {
                            val: 3,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '56%',
                                left: '6%'
                            }
                        },
                        wallsRightHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '63%',
                                right: '-8%'
                            }
                        },
                        roofSkirt: {
                            val: 0.2,
                            min: 0,
                            max: 1,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-6%',
                                left: '30%'
                            }
                        }
                    }
                }
            },
        },
    
        /** FRENCH */
        french: {
            noangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/french/plane-top.svg').default,
                    sizes: {
                        slopeBottomLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '25%'
                            }
                        },
                        slopeTopLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '68%'
                            }
                        },
                        ridgeLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '61%',
                                left: '4%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/french/plane-side.svg').default,
                    sizes: {
                        slopeTopHeight: {
                            val: 3,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '11%',
                                left: '6%'
                            }
                        },
                        slopeBottomHeight: {
                            val: 3,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '43%',
                                left: '6%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '67%',
                                right: '-12%'
                            }
                        },
                        houseWidth: {
                            val: 8,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-4%',
                                left: '55%'
                            }
                        }
                    }
                },
            },
    
            withangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/french/plane-top.svg').default,
                    sizes: {
                        slopeBottomLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '25%'
                            }
                        },
                        slopeTopLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '68%'
                            }
                        },
                        ridgeLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '61%',
                                left: '4%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/french/plane-side-angle.svg').default,
                    sizes: {
                        slopeLeftAngle: {
                            val: 35,
                            min: 14.99,
                            max: 85,
                            unit: i18n.tr('glob.unit-degrees'),
                            pos: {
                                top: '17%',
                                left: '37%'
                            }
                        },
                        slopeRightAngle: {
                            val: 80,
                            min: 14.99,
                            max: 85,
                            unit: i18n.tr('glob.unit-degrees'),
                            pos: {
                                top: '47%',
                                right: '31%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '67%',
                                right: '-12%'
                            }
                        },
                        houseWidth: {
                            val: 8,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-4%',
                                left: '46%'
                            }
                        }
                    }
                }
            },
        },
    
        /** HIP */
        hip: {
            noangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/hip/plane-top.svg').default,
                    sizes: {
                        slopeTrapezoidLength: {
                            val: 14,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '59%'
                            }
                        },
                        slopeTriangleLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '61%',
                                left: '4%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/hip/plane-side.svg').default,
                    sizes: {
                        ridgeLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '50%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '67%',
                                right: '-12%'
                            }
                        },
                        houseWidth: {
                            val: 8,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-4%',
                                left: '50%'
                            }
                        }
                    }
                }
            },
    
            withangle: {
                top: {
                    img: require('../../public/resources/images/roof-params/hip/plane-top.svg').default,
                    sizes: {
                        slopeTrapezoidLength: {
                            val: 14,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '59%'
                            }
                        },
                        slopeTriangleLength: {
                            val: 6,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '61%',
                                left: '4%'
                            }
                        }
                    }
                },
    
                side: {
                    img: require('../../public/resources/images/roof-params/hip/plane-side.svg').default,
                    sizes: {
                        ridgeLength: {
                            val: 8,
                            min: 0.1,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '8%',
                                left: '50%'
                            }
                        },
                        wallsMinHeight: {
                            val: 2,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                top: '67%',
                                right: '-12%'
                            }
                        },
                        houseWidth: {
                            val: 8,
                            min: 0.5,
                            max: 1000,
                            unit: i18n.tr('glob.unit-m'),
                            pos: {
                                bottom: '-4%',
                                left: '50%'
                            }
                        }
                    }
                }
            },
        }
    };
}