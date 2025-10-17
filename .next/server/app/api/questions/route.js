/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/questions/route";
exports.ids = ["app/api/questions/route"];
exports.modules = {

/***/ "(rsc)/./app/api/questions/route.ts":
/*!************************************!*\
  !*** ./app/api/questions/route.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_db__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/db */ \"(rsc)/./lib/db.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n/* harmony import */ var zod__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! zod */ \"(rsc)/./node_modules/zod/dist/esm/index.js\");\n\n\n\n\nconst dynamic = \"force-dynamic\";\nconst questionSchema = zod__WEBPACK_IMPORTED_MODULE_3__.z.object({\n    disciplina: zod__WEBPACK_IMPORTED_MODULE_3__.z[\"enum\"]([\n        'LINGUA_PORTUGUESA',\n        'MATEMATICA',\n        'CIENCIAS',\n        'HISTORIA',\n        'GEOGRAFIA',\n        'INGLES'\n    ]),\n    assunto: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().min(1, 'Assunto é obrigatório'),\n    enunciado: zod__WEBPACK_IMPORTED_MODULE_3__.z.string().min(1, 'Enunciado é obrigatório'),\n    alternativas: zod__WEBPACK_IMPORTED_MODULE_3__.z.array(zod__WEBPACK_IMPORTED_MODULE_3__.z.string()).length(5, 'Deve ter exatamente 5 alternativas'),\n    respostaCorreta: zod__WEBPACK_IMPORTED_MODULE_3__.z.number().min(0).max(4, 'Resposta correta deve ser entre 0 e 4'),\n    dificuldade: zod__WEBPACK_IMPORTED_MODULE_3__.z[\"enum\"]([\n        'FACIL',\n        'MEDIO',\n        'DIFICIL'\n    ])\n});\nasync function GET(request) {\n    try {\n        const token = request.cookies.get('token')?.value;\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Não autorizado'\n            }, {\n                status: 401\n            });\n        }\n        const payload = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyToken)(token);\n        if (!payload) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Token inválido'\n            }, {\n                status: 401\n            });\n        }\n        const { searchParams } = new URL(request.url);\n        const disciplina = searchParams.get('disciplina');\n        const assunto = searchParams.get('assunto');\n        const dificuldade = searchParams.get('dificuldade');\n        const page = parseInt(searchParams.get('page') || '1');\n        const limit = parseInt(searchParams.get('limit') || '10');\n        const where = {};\n        if (disciplina && disciplina !== 'all') where.disciplina = disciplina;\n        if (assunto && assunto !== 'all') where.assunto = {\n            contains: assunto,\n            mode: 'insensitive'\n        };\n        if (dificuldade && dificuldade !== 'all') where.dificuldade = dificuldade;\n        const [questions, total] = await Promise.all([\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.question.findMany({\n                where,\n                include: {\n                    professor: {\n                        select: {\n                            name: true\n                        }\n                    }\n                },\n                orderBy: {\n                    createdAt: 'desc'\n                },\n                skip: (page - 1) * limit,\n                take: limit\n            }),\n            _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.question.count({\n                where\n            })\n        ]);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            questions,\n            pagination: {\n                page,\n                limit,\n                total,\n                pages: Math.ceil(total / limit)\n            }\n        });\n    } catch (error) {\n        console.error('Erro ao buscar questões:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Erro interno do servidor'\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const token = request.cookies.get('token')?.value;\n        if (!token) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Não autorizado'\n            }, {\n                status: 401\n            });\n        }\n        const payload = (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.verifyToken)(token);\n        if (!payload || payload.type !== 'PROFESSOR') {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Apenas professores podem criar questões'\n            }, {\n                status: 403\n            });\n        }\n        const body = await request.json();\n        const data = questionSchema.parse(body);\n        const question = await _lib_db__WEBPACK_IMPORTED_MODULE_1__.prisma.question.create({\n            data: {\n                ...data,\n                professorId: payload.userId\n            },\n            include: {\n                professor: {\n                    select: {\n                        name: true\n                    }\n                }\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(question, {\n            status: 201\n        });\n    } catch (error) {\n        console.error('Erro ao criar questão:', error);\n        if (error instanceof zod__WEBPACK_IMPORTED_MODULE_3__.z.ZodError) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: error.errors[0].message\n            }, {\n                status: 400\n            });\n        }\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Erro interno do servidor'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LHFEQUFZQSxDQUFDMEIsSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBMkIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDaEY7QUFDRiIsInNvdXJjZXMiOlsiRDpcXGFwcFxcYXBwXFxhcGlcXHF1ZXN0aW9uc1xccm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvZGInO1xuaW1wb3J0IHsgdmVyaWZ5VG9rZW4gfSBmcm9tICdAL2xpYi9hdXRoJztcbmltcG9ydCB7IHogfSBmcm9tICd6b2QnO1xuXG5leHBvcnQgY29uc3QgZHluYW1pYyA9IFwiZm9yY2UtZHluYW1pY1wiO1xuXG5jb25zdCBxdWVzdGlvblNjaGVtYSA9IHoub2JqZWN0KHtcbiAgZGlzY2lwbGluYTogei5lbnVtKFsnTElOR1VBX1BPUlRVR1VFU0EnLCAnTUFURU1BVElDQScsICdDSUVOQ0lBUycsICdISVNUT1JJQScsICdHRU9HUkFGSUEnLCAnSU5HTEVTJ10pLFxuICBhc3N1bnRvOiB6LnN0cmluZygpLm1pbigxLCAnQXNzdW50byDDqSBvYnJpZ2F0w7NyaW8nKSxcbiAgZW51bmNpYWRvOiB6LnN0cmluZygpLm1pbigxLCAnRW51bmNpYWRvIMOpIG9icmlnYXTDs3JpbycpLFxuICBhbHRlcm5hdGl2YXM6IHouYXJyYXkoei5zdHJpbmcoKSkubGVuZ3RoKDUsICdEZXZlIHRlciBleGF0YW1lbnRlIDUgYWx0ZXJuYXRpdmFzJyksXG4gIHJlc3Bvc3RhQ29ycmV0YTogei5udW1iZXIoKS5taW4oMCkubWF4KDQsICdSZXNwb3N0YSBjb3JyZXRhIGRldmUgc2VyIGVudHJlIDAgZSA0JyksXG4gIGRpZmljdWxkYWRlOiB6LmVudW0oWydGQUNJTCcsICdNRURJTycsICdESUZJQ0lMJ10pLFxufSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b2tlbiA9IHJlcXVlc3QuY29va2llcy5nZXQoJ3Rva2VuJyk/LnZhbHVlO1xuICAgIGlmICghdG9rZW4pIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnTsOjbyBhdXRvcml6YWRvJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IHBheWxvYWQgPSB2ZXJpZnlUb2tlbih0b2tlbik7XG4gICAgaWYgKCFwYXlsb2FkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1Rva2VuIGludsOhbGlkbycgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgICB9XG5cbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybCk7XG4gICAgY29uc3QgZGlzY2lwbGluYSA9IHNlYXJjaFBhcmFtcy5nZXQoJ2Rpc2NpcGxpbmEnKTtcbiAgICBjb25zdCBhc3N1bnRvID0gc2VhcmNoUGFyYW1zLmdldCgnYXNzdW50bycpO1xuICAgIGNvbnN0IGRpZmljdWxkYWRlID0gc2VhcmNoUGFyYW1zLmdldCgnZGlmaWN1bGRhZGUnKTtcbiAgICBjb25zdCBwYWdlID0gcGFyc2VJbnQoc2VhcmNoUGFyYW1zLmdldCgncGFnZScpIHx8ICcxJyk7XG4gICAgY29uc3QgbGltaXQgPSBwYXJzZUludChzZWFyY2hQYXJhbXMuZ2V0KCdsaW1pdCcpIHx8ICcxMCcpO1xuXG4gICAgY29uc3Qgd2hlcmU6IGFueSA9IHt9O1xuICAgIGlmIChkaXNjaXBsaW5hICYmIGRpc2NpcGxpbmEgIT09ICdhbGwnKSB3aGVyZS5kaXNjaXBsaW5hID0gZGlzY2lwbGluYTtcbiAgICBpZiAoYXNzdW50byAmJiBhc3N1bnRvICE9PSAnYWxsJykgd2hlcmUuYXNzdW50byA9IHsgY29udGFpbnM6IGFzc3VudG8sIG1vZGU6ICdpbnNlbnNpdGl2ZScgfTtcbiAgICBpZiAoZGlmaWN1bGRhZGUgJiYgZGlmaWN1bGRhZGUgIT09ICdhbGwnKSB3aGVyZS5kaWZpY3VsZGFkZSA9IGRpZmljdWxkYWRlO1xuXG4gICAgY29uc3QgW3F1ZXN0aW9ucywgdG90YWxdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgcHJpc21hLnF1ZXN0aW9uLmZpbmRNYW55KHtcbiAgICAgICAgd2hlcmUsXG4gICAgICAgIGluY2x1ZGU6IHtcbiAgICAgICAgICBwcm9mZXNzb3I6IHtcbiAgICAgICAgICAgIHNlbGVjdDogeyBuYW1lOiB0cnVlIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgb3JkZXJCeTogeyBjcmVhdGVkQXQ6ICdkZXNjJyB9LFxuICAgICAgICBza2lwOiAocGFnZSAtIDEpICogbGltaXQsXG4gICAgICAgIHRha2U6IGxpbWl0LFxuICAgICAgfSksXG4gICAgICBwcmlzbWEucXVlc3Rpb24uY291bnQoeyB3aGVyZSB9KSxcbiAgICBdKTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7XG4gICAgICBxdWVzdGlvbnMsXG4gICAgICBwYWdpbmF0aW9uOiB7XG4gICAgICAgIHBhZ2UsXG4gICAgICAgIGxpbWl0LFxuICAgICAgICB0b3RhbCxcbiAgICAgICAgcGFnZXM6IE1hdGguY2VpbCh0b3RhbCAvIGxpbWl0KSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJybyBhbyBidXNjYXIgcXVlc3TDtWVzOicsIGVycm9yKTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0Vycm8gaW50ZXJubyBkbyBzZXJ2aWRvcicgfSwgeyBzdGF0dXM6IDUwMCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHRva2VuID0gcmVxdWVzdC5jb29raWVzLmdldCgndG9rZW4nKT8udmFsdWU7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdOw6NvIGF1dG9yaXphZG8nIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF5bG9hZCA9IHZlcmlmeVRva2VuKHRva2VuKTtcbiAgICBpZiAoIXBheWxvYWQgfHwgcGF5bG9hZC50eXBlICE9PSAnUFJPRkVTU09SJykge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdBcGVuYXMgcHJvZmVzc29yZXMgcG9kZW0gY3JpYXIgcXVlc3TDtWVzJyB9LCB7IHN0YXR1czogNDAzIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcbiAgICBjb25zdCBkYXRhID0gcXVlc3Rpb25TY2hlbWEucGFyc2UoYm9keSk7XG5cbiAgICBjb25zdCBxdWVzdGlvbiA9IGF3YWl0IHByaXNtYS5xdWVzdGlvbi5jcmVhdGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBwcm9mZXNzb3JJZDogcGF5bG9hZC51c2VySWQsXG4gICAgICB9LFxuICAgICAgaW5jbHVkZToge1xuICAgICAgICBwcm9mZXNzb3I6IHtcbiAgICAgICAgICBzZWxlY3Q6IHsgbmFtZTogdHJ1ZSB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbihxdWVzdGlvbiwgeyBzdGF0dXM6IDIwMSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvIGFvIGNyaWFyIHF1ZXN0w6NvOicsIGVycm9yKTtcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiB6LlpvZEVycm9yKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogZXJyb3IuZXJyb3JzWzBdLm1lc3NhZ2UgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdFcnJvIGludGVybm8gZG8gc2Vydmlkb3InIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJ2ZXJpZnlUb2tlbiIsInoiLCJkeW5hbWljIiwicXVlc3Rpb25TY2hlbWEiLCJvYmplY3QiLCJkaXNjaXBsaW5hIiwiZW51bSIsImFzc3VudG8iLCJzdHJpbmciLCJtaW4iLCJlbnVuY2lhZG8iLCJhbHRlcm5hdGl2YXMiLCJhcnJheSIsImxlbmd0aCIsInJlc3Bvc3RhQ29ycmV0YSIsIm51bWJlciIsIm1heCIsImRpZmljdWxkYWRlIiwiR0VUIiwicmVxdWVzdCIsInRva2VuIiwiY29va2llcyIsImdldCIsInZhbHVlIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwicGF5bG9hZCIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsInBhZ2UiLCJwYXJzZUludCIsImxpbWl0Iiwid2hlcmUiLCJjb250YWlucyIsIm1vZGUiLCJxdWVzdGlvbnMiLCJ0b3RhbCIsIlByb21pc2UiLCJhbGwiLCJxdWVzdGlvbiIsImZpbmRNYW55IiwiaW5jbHVkZSIsInByb2Zlc3NvciIsInNlbGVjdCIsIm5hbWUiLCJvcmRlckJ5IiwiY3JlYXRlZEF0Iiwic2tpcCIsInRha2UiLCJjb3VudCIsInBhZ2luYXRpb24iLCJwYWdlcyIsIk1hdGgiLCJjZWlsIiwiY29uc29sZSIsIlBPU1QiLCJ0eXBlIiwiYm9keSIsImRhdGEiLCJwYXJzZSIsImNyZWF0ZSIsInByb2Zlc3NvcklkIiwidXNlcklkIiwiWm9kRXJyb3IiLCJlcnJvcnMiLCJtZXNzYWdlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/questions/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   comparePassword: () => (/* binding */ comparePassword),\n/* harmony export */   generateToken: () => (/* binding */ generateToken),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   verifyToken: () => (/* binding */ verifyToken)\n/* harmony export */ });\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! jsonwebtoken */ \"(rsc)/./node_modules/jsonwebtoken/index.js\");\n/* harmony import */ var jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(jsonwebtoken__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n\n\nconst JWT_SECRET = process.env.JWT_SECRET || 'ifpi-platform-secret-key';\nfunction generateToken(user) {\n    return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().sign({\n        userId: user.id,\n        email: user.email,\n        type: user.type\n    }, JWT_SECRET, {\n        expiresIn: '7d'\n    });\n}\nfunction verifyToken(token) {\n    try {\n        return jsonwebtoken__WEBPACK_IMPORTED_MODULE_0___default().verify(token, JWT_SECRET);\n    } catch  {\n        return null;\n    }\n}\nasync function hashPassword(password) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"].hash(password, 12);\n}\nasync function comparePassword(password, hash) {\n    return bcryptjs__WEBPACK_IMPORTED_MODULE_1__[\"default\"].compare(password, hash);\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQytCO0FBQ0Q7QUFjOUIsTUFBTUUsYUFBYUMsUUFBUUMsR0FBRyxDQUFDRixVQUFVLElBQUk7QUFRdEMsU0FBU0csY0FBY0MsSUFBVTtJQUN0QyxPQUFPTix3REFBUSxDQUNiO1FBQ0VRLFFBQVFGLEtBQUtHLEVBQUU7UUFDZkMsT0FBT0osS0FBS0ksS0FBSztRQUNqQkMsTUFBTUwsS0FBS0ssSUFBSTtJQUNqQixHQUNBVCxZQUNBO1FBQUVVLFdBQVc7SUFBSztBQUV0QjtBQUVPLFNBQVNDLFlBQVlDLEtBQWE7SUFDdkMsSUFBSTtRQUNGLE9BQU9kLDBEQUFVLENBQUNjLE9BQU9aO0lBQzNCLEVBQUUsT0FBTTtRQUNOLE9BQU87SUFDVDtBQUNGO0FBRU8sZUFBZWMsYUFBYUMsUUFBZ0I7SUFDakQsT0FBT2hCLHFEQUFXLENBQUNnQixVQUFVO0FBQy9CO0FBRU8sZUFBZUUsZ0JBQWdCRixRQUFnQixFQUFFQyxJQUFZO0lBQ2xFLE9BQU9qQix3REFBYyxDQUFDZ0IsVUFBVUM7QUFDbEMiLCJzb3VyY2VzIjpbIkQ6XFxhcHBcXGxpYlxcYXV0aC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCBqd3QgZnJvbSAnanNvbndlYnRva2VuJztcbmltcG9ydCBiY3J5cHQgZnJvbSAnYmNyeXB0anMnO1xuXG50eXBlIFVzZXIgPSB7XG4gIGlkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgdHlwZTogJ1BST0ZFU1NPUicgfCAnQUxVTk8nO1xuICBwb2ludHM6IG51bWJlcjtcbiAgbGV2ZWw6IG51bWJlcjtcbiAgbWVkYWxzOiBzdHJpbmdbXTtcbiAgY3JlYXRlZEF0OiBEYXRlO1xuICB1cGRhdGVkQXQ6IERhdGU7XG59O1xuXG5jb25zdCBKV1RfU0VDUkVUID0gcHJvY2Vzcy5lbnYuSldUX1NFQ1JFVCB8fCAnaWZwaS1wbGF0Zm9ybS1zZWNyZXQta2V5JztcblxuZXhwb3J0IGludGVyZmFjZSBKV1RQYXlsb2FkIHtcbiAgdXNlcklkOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIHR5cGU6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVG9rZW4odXNlcjogVXNlcik6IHN0cmluZyB7XG4gIHJldHVybiBqd3Quc2lnbihcbiAgICB7XG4gICAgICB1c2VySWQ6IHVzZXIuaWQsXG4gICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgIHR5cGU6IHVzZXIudHlwZSxcbiAgICB9LFxuICAgIEpXVF9TRUNSRVQsXG4gICAgeyBleHBpcmVzSW46ICc3ZCcgfVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VG9rZW4odG9rZW46IHN0cmluZyk6IEpXVFBheWxvYWQgfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gand0LnZlcmlmeSh0b2tlbiwgSldUX1NFQ1JFVCkgYXMgSldUUGF5bG9hZDtcbiAgfSBjYXRjaCB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhc2hQYXNzd29yZChwYXNzd29yZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgcmV0dXJuIGJjcnlwdC5oYXNoKHBhc3N3b3JkLCAxMik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb21wYXJlUGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaDogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBiY3J5cHQuY29tcGFyZShwYXNzd29yZCwgaGFzaCk7XG59XG4iXSwibmFtZXMiOlsiand0IiwiYmNyeXB0IiwiSldUX1NFQ1JFVCIsInByb2Nlc3MiLCJlbnYiLCJnZW5lcmF0ZVRva2VuIiwidXNlciIsInNpZ24iLCJ1c2VySWQiLCJpZCIsImVtYWlsIiwidHlwZSIsImV4cGlyZXNJbiIsInZlcmlmeVRva2VuIiwidG9rZW4iLCJ2ZXJpZnkiLCJoYXNoUGFzc3dvcmQiLCJwYXNzd29yZCIsImhhc2giLCJjb21wYXJlUGFzc3dvcmQiLCJjb21wYXJlIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/db.ts":
/*!*******************!*\
  !*** ./lib/db.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvZGIudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQThDO0FBRTlDLE1BQU1DLGtCQUFrQkM7QUFJakIsTUFBTUMsU0FBU0YsZ0JBQWdCRSxNQUFNLElBQUksSUFBSUgsd0RBQVlBLEdBQUc7QUFFbkUsSUFBSUksSUFBcUMsRUFBRUgsZ0JBQWdCRSxNQUFNLEdBQUdBIiwic291cmNlcyI6WyJEOlxcYXBwXFxsaWJcXGRiLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByaXNtYUNsaWVudCB9IGZyb20gJ0BwcmlzbWEvY2xpZW50JztcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59O1xuXG5leHBvcnQgY29uc3QgcHJpc21hID0gZ2xvYmFsRm9yUHJpc21hLnByaXNtYSA/PyBuZXcgUHJpc21hQ2xpZW50KCk7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID0gcHJpc21hO1xuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/db.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fquestions%2Froute&page=%2Fapi%2Fquestions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fquestions%2Froute.ts&appDir=D%3A%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fquestions%2Froute&page=%2Fapi%2Fquestions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fquestions%2Froute.ts&appDir=D%3A%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var D_app_app_api_questions_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/questions/route.ts */ \"(rsc)/./app/api/questions/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/questions/route\",\n        pathname: \"/api/questions\",\n        filename: \"route\",\n        bundlePath: \"app/api/questions/route\"\n    },\n    resolvedPagePath: \"D:\\\\app\\\\app\\\\api\\\\questions\\\\route.ts\",\n    nextConfigOutput,\n    userland: D_app_app_api_questions_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZxdWVzdGlvbnMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRnF1ZXN0aW9ucyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRnF1ZXN0aW9ucyUyRnJvdXRlLnRzJmFwcERpcj1EJTNBJTVDYXBwJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1EJTNBJTVDYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNWO0FBQ25FO0FBQ0E7QUFDQTtBQUNBLHdCQUF3Qix5R0FBbUI7QUFDM0M7QUFDQSxjQUFjLGtFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsc0RBQXNEO0FBQzlEO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzBGOztBQUUxRiIsInNvdXJjZXMiOlsiIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCJEOlxcXFxhcHBcXFxcYXBwXFxcXGFwaVxcXFxxdWVzdGlvbnNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3F1ZXN0aW9ucy9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL3F1ZXN0aW9uc1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvcXVlc3Rpb25zL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiRDpcXFxcYXBwXFxcXGFwcFxcXFxhcGlcXFxccXVlc3Rpb25zXFxcXHJvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fquestions%2Froute&page=%2Fapi%2Fquestions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fquestions%2Froute.ts&appDir=D%3A%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/semver","vendor-chunks/bcryptjs","vendor-chunks/jsonwebtoken","vendor-chunks/lodash.includes","vendor-chunks/jws","vendor-chunks/lodash.once","vendor-chunks/jwa","vendor-chunks/lodash.isinteger","vendor-chunks/ecdsa-sig-formatter","vendor-chunks/lodash.isplainobject","vendor-chunks/ms","vendor-chunks/lodash.isstring","vendor-chunks/lodash.isnumber","vendor-chunks/lodash.isboolean","vendor-chunks/safe-buffer","vendor-chunks/buffer-equal-constant-time","vendor-chunks/zod"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fquestions%2Froute&page=%2Fapi%2Fquestions%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fquestions%2Froute.ts&appDir=D%3A%5Capp%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=D%3A%5Capp&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();