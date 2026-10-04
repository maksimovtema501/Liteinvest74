/* Расширенный словарь «Лингво»: ещё ~1900 слов к базовому (words.js).
   Формат как в words.js: слово|перевод|пример|перевод примера.
   Заголовок #УРОВЕНЬ:тема задаёт уровень и тему для марафона:
   #A2:food — слова уровня A2 из темы «Еда». #CH и #PV — фразы и фразовые глаголы. */
const WORDS_EXT = `
#A1:food
apple|яблоко|An apple a day keeps the doctor away.|Кто ест яблоко в день, тот не болеет.
banana|банан|I have a banana for breakfast.|На завтрак я ем банан.
orange|апельсин; оранжевый|Can I have an orange juice?|Можно апельсиновый сок?
egg|яйцо|I eat two eggs every morning.|Я ем два яйца каждое утро.
milk|молоко|We need some milk.|Нам нужно молоко.
tea|чай|Would you like some tea?|Хотите чаю?
juice|сок|A glass of juice, please.|Стакан сока, пожалуйста.
cheese|сыр|I love French cheese.|Обожаю французский сыр.
meat|мясо|I don't eat meat.|Я не ем мясо.
fish|рыба|We had fish for dinner.|На ужин у нас была рыба.
chicken|курица|The chicken is delicious.|Курица очень вкусная.
rice|рис|Rice or potatoes?|Рис или картошка?
potato|картофель|I'll peel the potatoes.|Я почищу картошку.
salt|соль|Pass me the salt, please.|Передай соль, пожалуйста.
sugar|сахар|No sugar, thanks.|Без сахара, спасибо.
soup|суп|This soup is too hot.|Этот суп слишком горячий.
cake|торт, пирожное|She made a chocolate cake.|Она испекла шоколадный торт.
fruit|фрукты|Eat more fruit.|Ешь больше фруктов.
vegetable|овощ|I grow vegetables in my garden.|Я выращиваю овощи в саду.
sandwich|бутерброд|I'll make a sandwich.|Сделаю бутерброд.
pizza|пицца|Let's order pizza.|Давай закажем пиццу.
chocolate|шоколад|I can't live without chocolate.|Не могу жить без шоколада.
ice cream|мороженое|Kids love ice cream.|Дети обожают мороженое.
glass|стакан; стекло|A glass of water, please.|Стакан воды, пожалуйста.
cup|чашка|Would you like a cup of coffee?|Хочешь чашку кофе?
plate|тарелка|Put it on a plate.|Положи это на тарелку.
fork|вилка|Can I have a fork?|Можно вилку?
knife|нож|Be careful with that knife.|Осторожно с этим ножом.
spoon|ложка|I need a spoon for my soup.|Мне нужна ложка для супа.
restaurant|ресторан|Let's go to a restaurant.|Пойдём в ресторан.
cafe|кафе|Let's meet at the cafe.|Встретимся в кафе.
menu|меню|Can I see the menu?|Можно меню?
delicious|очень вкусный|This is delicious!|Это очень вкусно!
#A2:food
tomato|помидор|Add some tomatoes to the salad.|Добавь помидоры в салат.
onion|лук|Chopping onions makes me cry.|От резки лука я плачу.
carrot|морковь|Rabbits love carrots.|Кролики любят морковь.
garlic|чеснок|Add a little garlic.|Добавь немного чеснока.
mushroom|гриб|We picked mushrooms in the forest.|Мы собирали грибы в лесу.
pepper|перец|Salt and pepper?|Соль и перец?
beef|говядина|I'd like the beef, please.|Мне говядину, пожалуйста.
pork|свинина|He doesn't eat pork.|Он не ест свинину.
butter|сливочное масло|Bread and butter.|Хлеб с маслом.
oil|растительное масло; нефть|Fry it in olive oil.|Обжарь на оливковом масле.
flour|мука|Mix the flour and the eggs.|Смешай муку и яйца.
pasta|макароны, паста|I'll cook pasta tonight.|Сегодня приготовлю пасту.
salad|салат|A green salad, please.|Зелёный салат, пожалуйста.
dessert|десерт|What's for dessert?|Что на десерт?
snack|перекус|I need a quick snack.|Мне нужно быстро перекусить.
recipe|рецепт|Can you give me the recipe?|Дашь рецепт?
taste|вкус; пробовать на вкус|It tastes great.|На вкус отлично.
sweet|сладкий|This tea is too sweet.|Этот чай слишком сладкий.
salty|солёный|The soup is a bit salty.|Суп немного солёный.
spicy|острый|I love spicy food.|Обожаю острую еду.
fresh|свежий|The bread is fresh.|Хлеб свежий.
raw|сырой|Don't eat raw meat.|Не ешь сырое мясо.
boil|кипятить, варить|Boil the water first.|Сначала вскипяти воду.
fry|жарить|Fry the onions for five minutes.|Обжарь лук пять минут.
bake|печь|My grandma bakes bread.|Бабушка печёт хлеб.
mix|смешивать|Mix everything together.|Перемешай всё.
pour|наливать|Can you pour me some wine?|Налей мне вина?
cut|резать|Cut the bread, please.|Порежь хлеб, пожалуйста.
waiter|официант|The waiter brought the menu.|Официант принёс меню.
tip|чаевые; совет|Did you leave a tip?|Ты оставил чаевые?
diet|диета, рацион|I'm on a diet.|Я на диете.
vegetarian|вегетарианец|She is vegetarian.|Она вегетарианка.
bottle|бутылка|A bottle of water, please.|Бутылку воды, пожалуйста.
wine|вино|Red or white wine?|Красное или белое вино?
beer|пиво|Let's have a beer after work.|Давай выпьем пива после работы.
#B1:food
ingredient|ингредиент|What are the main ingredients?|Какие основные ингредиенты?
portion|порция|The portions here are huge.|Порции здесь огромные.
dish|блюдо; тарелка|What's your favourite dish?|Какое твоё любимое блюдо?
cuisine|кухня (национальная)|I love Italian cuisine.|Люблю итальянскую кухню.
flavour|вкус, аромат|Which flavour do you want?|Какой вкус хочешь?
bitter|горький|The coffee is too bitter.|Кофе слишком горький.
sour|кислый|These apples are sour.|Эти яблоки кислые.
starving|умирающий от голода|I'm starving!|Я умираю с голоду!
leftovers|остатки еды|We had leftovers for lunch.|На обед мы доели вчерашнее.
takeaway|еда навынос|Let's get a takeaway tonight.|Давай возьмём еду навынос.
grill|гриль; жарить на гриле|We grilled sausages.|Мы жарили сосиски на гриле.
roast|запекать; жареный|Roast chicken with potatoes.|Запечённая курица с картошкой.
slice|кусок, ломтик|Another slice of pizza?|Ещё кусочек пиццы?
appetite|аппетит|I have no appetite.|У меня нет аппетита.
nutrition|питание|Good nutrition is important.|Правильное питание важно.
#A1:home
bed|кровать|Go to bed!|Иди спать!
chair|стул|Take a chair.|Возьми стул.
sofa|диван|He fell asleep on the sofa.|Он уснул на диване.
window|окно|Open the window.|Открой окно.
wall|стена|There's a picture on the wall.|На стене картина.
floor|пол; этаж|I live on the third floor.|Я живу на третьем этаже.
bathroom|ванная|Where's the bathroom?|Где ванная?
bedroom|спальня|My bedroom is upstairs.|Моя спальня наверху.
garden|сад|We have a small garden.|У нас маленький сад.
key|ключ|I lost my key.|Я потерял ключ.
box|коробка|Put it in the box.|Положи в коробку.
bag|сумка|My bag is heavy.|Моя сумка тяжёлая.
computer|компьютер|My computer is slow.|Мой компьютер тормозит.
TV|телевизор|Turn off the TV.|Выключи телевизор.
lamp|лампа|Turn on the lamp.|Включи лампу.
shower|душ|I take a shower every morning.|Я принимаю душ каждое утро.
cat|кошка|My cat sleeps all day.|Моя кошка спит весь день.
pet|домашнее животное|Do you have any pets?|У тебя есть домашние животные?
#A2:home
furniture|мебель|We need new furniture.|Нам нужна новая мебель.
cupboard|шкаф (кухонный)|The cups are in the cupboard.|Чашки в шкафу.
wardrobe|платяной шкаф|My wardrobe is full.|Мой шкаф забит.
shelf|полка|Put the books on the shelf.|Поставь книги на полку.
mirror|зеркало|Look in the mirror.|Посмотри в зеркало.
carpet|ковёр|The carpet is dirty.|Ковёр грязный.
pillow|подушка|I need a softer pillow.|Мне нужна подушка помягче.
blanket|одеяло, плед|It's cold, take a blanket.|Холодно, возьми плед.
fridge|холодильник|There's nothing in the fridge.|В холодильнике пусто.
oven|духовка|Put the cake in the oven.|Поставь торт в духовку.
cooker|плита|Is the cooker gas or electric?|Плита газовая или электрическая?
sink|раковина|The sink is full of dishes.|Раковина полна посуды.
toilet|туалет|Where's the toilet?|Где туалет?
stairs|лестница|Take the stairs.|Иди по лестнице.
lift|лифт|The lift is broken.|Лифт сломан.
roof|крыша|The roof is leaking.|Крыша протекает.
balcony|балкон|We have breakfast on the balcony.|Мы завтракаем на балконе.
ceiling|потолок|The ceiling is very high.|Потолок очень высокий.
light|свет; лёгкий|Turn off the light.|Выключи свет.
towel|полотенце|Can I have a clean towel?|Можно чистое полотенце?
soap|мыло|Wash your hands with soap.|Мой руки с мылом.
rubbish|мусор|Take out the rubbish.|Вынеси мусор.
mess|беспорядок|What a mess!|Какой бардак!
tidy|аккуратный; убирать|Tidy your room!|Убери комнату!
iron|утюг; гладить|I hate ironing shirts.|Ненавижу гладить рубашки.
vacuum|пылесосить|I vacuum every Saturday.|Я пылесошу каждую субботу.
repair|ремонтировать|Can you repair my bike?|Можешь починить мой велосипед?
neighbourhood|район|It's a quiet neighbourhood.|Это тихий район.
address|адрес|What's your address?|Какой у тебя адрес?
move|двигать; переезжать|We moved last year.|Мы переехали в прошлом году.
heating|отопление|The heating isn't working.|Отопление не работает.
alarm clock|будильник|I didn't hear my alarm clock.|Я не слышал будильник.
#B1:home
landlord|арендодатель|The landlord raised the rent.|Хозяин поднял арендную плату.
tenant|жилец, арендатор|The previous tenant left a mess.|Прежний жилец оставил бардак.
mortgage|ипотека|We took out a mortgage.|Мы взяли ипотеку.
deposit|залог; вклад|You pay a deposit of one month's rent.|Залог — арендная плата за месяц.
bills|коммунальные платежи, счета|Are bills included?|Коммуналка включена?
appliance|бытовой прибор|Kitchen appliances are expensive.|Кухонная техника дорогая.
plug|вилка (электр.); подключать|Plug it in.|Включи в розетку.
socket|розетка|There's no socket near the bed.|У кровати нет розетки.
leak|протекать; утечка|The tap is leaking.|Кран течёт.
tap|кран|Turn off the tap.|Закрой кран.
drawer|ящик (выдвижной)|The keys are in the top drawer.|Ключи в верхнем ящике.
cosy|уютный|What a cosy flat!|Какая уютная квартира!
spacious|просторный|The living room is spacious.|Гостиная просторная.
household|домашнее хозяйство|Household chores take time.|Домашние дела отнимают время.
chores|домашние дела|We share the chores.|Мы делим домашние дела.
renovation|ремонт (капитальный)|The renovation took six months.|Ремонт занял полгода.
#A1:shop
shirt|рубашка|He's wearing a white shirt.|На нём белая рубашка.
T-shirt|футболка|I bought a new T-shirt.|Я купил новую футболку.
dress|платье|What a beautiful dress!|Какое красивое платье!
shoes|обувь, туфли|These shoes are comfortable.|Эти туфли удобные.
jacket|куртка, пиджак|Take your jacket, it's cold.|Возьми куртку, холодно.
coat|пальто|She has a long black coat.|У неё длинное чёрное пальто.
trousers|брюки|These trousers are too long.|Эти брюки слишком длинные.
jeans|джинсы|I always wear jeans.|Я всегда хожу в джинсах.
hat|шляпа, шапка|Put on your hat.|Надень шапку.
size|размер|What size do you wear?|Какой у тебя размер?
colour|цвет|What's your favourite colour?|Какой твой любимый цвет?
red|красный|She has a red car.|У неё красная машина.
blue|синий, голубой|The sky is blue.|Небо голубое.
green|зелёный|I like green tea.|Люблю зелёный чай.
black|чёрный|I drink my coffee black.|Я пью чёрный кофе.
white|белый|Snow is white.|Снег белый.
yellow|жёлтый|A yellow taxi.|Жёлтое такси.
grey|серый|It's a grey day.|Серый день.
brown|коричневый|He has brown eyes.|У него карие глаза.
pink|розовый|She loves pink.|Она обожает розовый.
market|рынок|We buy vegetables at the market.|Мы покупаем овощи на рынке.
supermarket|супермаркет|I'm going to the supermarket.|Я иду в супермаркет.
card|карта, открытка|Can I pay by card?|Можно оплатить картой?
cash|наличные|I don't have any cash.|У меня нет наличных.
#A2:shop
sweater|свитер|I need a warm sweater.|Мне нужен тёплый свитер.
skirt|юбка|She's wearing a short skirt.|На ней короткая юбка.
boots|ботинки, сапоги|My boots are wet.|Мои ботинки промокли.
trainers|кроссовки|I run in these trainers.|Я бегаю в этих кроссовках.
socks|носки|I can't find my socks.|Не могу найти носки.
gloves|перчатки|Don't forget your gloves.|Не забудь перчатки.
scarf|шарф|A warm scarf.|Тёплый шарф.
belt|ремень|This belt is too tight.|Этот ремень слишком тугой.
pocket|карман|It's in my pocket.|Это у меня в кармане.
fashion|мода|She works in fashion.|Она работает в сфере моды.
style|стиль|I like your style.|Мне нравится твой стиль.
try on|примерять|Can I try it on?|Можно примерить?
fit|подходить (по размеру)|These jeans don't fit me.|Эти джинсы мне не подходят.
suit|костюм; подходить|Red really suits you.|Красный тебе очень идёт.
sale|распродажа|Everything is on sale.|На всё скидки.
discount|скидка|Can I get a discount?|Можно скидку?
receipt|чек|Keep the receipt.|Сохрани чек.
queue|очередь|There's a long queue.|Там длинная очередь.
shopping centre|торговый центр|Let's go to the shopping centre.|Пойдём в торговый центр.
pharmacy|аптека|Is there a pharmacy near here?|Здесь есть аптека поблизости?
bakery|пекарня|Buy bread at the bakery.|Купи хлеб в пекарне.
customer service|служба поддержки|I called customer service.|Я позвонил в поддержку.
brand|бренд, марка|What brand is it?|Какой это бренд?
online|онлайн, в интернете|I buy clothes online.|Я покупаю одежду в интернете.
deliver|доставлять|They deliver in two days.|Доставляют за два дня.
#B1:shop
refund|возврат денег|I'd like a refund.|Я хочу вернуть деньги.
exchange|обменивать; обмен|Can I exchange it for a smaller size?|Можно обменять на размер меньше?
bargain|выгодная покупка|It was a real bargain.|Это была очень выгодная покупка.
afford to|позволить себе|We can't afford to buy a house.|Мы не можем позволить себе дом.
purchase|покупка; покупать|Thank you for your purchase.|Спасибо за покупку.
guarantee|гарантия|It has a two-year guarantee.|Гарантия два года.
second-hand|подержанный|I bought a second-hand car.|Я купил подержанную машину.
overpriced|слишком дорогой|This cafe is overpriced.|В этом кафе всё задорого.
loose|свободный (об одежде)|I prefer loose clothes.|Предпочитаю свободную одежду.
tight|тесный, тугой|These shoes are too tight.|Эти туфли жмут.
casual|повседневный|Casual clothes are fine.|Можно в повседневной одежде.
smart|нарядный; умный|Wear something smart.|Надень что-нибудь нарядное.
outfit|наряд, образ|I love your outfit!|Обожаю твой наряд!
#A1:people
boy|мальчик|The boy is playing football.|Мальчик играет в футбол.
girl|девочка, девушка|That girl is my sister.|Та девочка — моя сестра.
baby|младенец|The baby is sleeping.|Малыш спит.
parents|родители|My parents live in Kazan.|Мои родители живут в Казани.
son|сын|Their son is five.|Их сыну пять.
daughter|дочь|She has two daughters.|У неё две дочери.
husband|муж|My husband is a pilot.|Мой муж — пилот.
wife|жена|This is my wife, Anna.|Это моя жена Анна.
grandmother|бабушка|My grandmother is ninety.|Моей бабушке девяносто.
grandfather|дедушка|My grandfather was a soldier.|Мой дедушка был солдатом.
kid|ребёнок (разг.)|The kids are at school.|Дети в школе.
teacher|учитель|My teacher is very kind.|Мой учитель очень добрый.
student|студент|I'm a student.|Я студент.
doctor|врач|You should see a doctor.|Тебе стоит сходить к врачу.
person|человек|She's a nice person.|Она хороший человек.
age|возраст|What's your age?|Сколько тебе лет?
tall|высокий|He's very tall.|Он очень высокий.
short|низкий; короткий|She has short hair.|У неё короткие волосы.
hair|волосы|She has long hair.|У неё длинные волосы.
#A2:people
uncle|дядя|My uncle lives in Canada.|Мой дядя живёт в Канаде.
aunt|тётя|My aunt is a nurse.|Моя тётя — медсестра.
cousin|двоюродный брат/сестра|My cousin is my best friend.|Мой двоюродный брат — мой лучший друг.
nephew|племянник|My nephew is three.|Моему племяннику три.
niece|племянница|I bought a gift for my niece.|Я купил подарок племяннице.
boyfriend|парень (молодой человек)|Her boyfriend is Spanish.|Её парень — испанец.
girlfriend|девушка (подруга)|I'm meeting my girlfriend tonight.|Вечером встречаюсь с девушкой.
couple|пара|They're a lovely couple.|Они прекрасная пара.
wedding|свадьба|We were invited to their wedding.|Нас пригласили на их свадьбу.
marry|жениться, выходить замуж|Will you marry me?|Ты выйдешь за меня?
married|женатый, замужем|Are you married?|Ты женат?
single|холостой, не замужем; одиночный|I'm single.|Я не в отношениях.
divorce|развод; разводиться|They got divorced last year.|Они развелись в прошлом году.
pregnant|беременная|She's pregnant.|Она беременна.
teenager|подросток|Teenagers sleep a lot.|Подростки много спят.
adult|взрослый|Tickets for adults are ten euros.|Билет для взрослых — десять евро.
stranger|незнакомец|Don't talk to strangers.|Не разговаривай с незнакомцами.
partner|партнёр|Bring your partner to the party.|Приходи на вечеринку со второй половинкой.
relative|родственник|All my relatives came.|Пришли все мои родственники.
beard|борода|He has a long beard.|У него длинная борода.
thin|худой; тонкий|She's very thin.|Она очень худая.
fat|толстый; жир|My cat is getting fat.|Мой кот толстеет.
pretty|симпатичная; довольно|She's very pretty.|Она очень симпатичная.
handsome|красивый (о мужчине)|What a handsome man!|Какой красивый мужчина!
ugly|уродливый|It's an ugly building.|Это уродливое здание.
look like|быть похожим на|You look like your mother.|Ты похож на маму.
born|рождённый|I was born in 1995.|Я родился в 1995 году.
die|умирать|My grandfather died last year.|Мой дедушка умер в прошлом году.
#B1:people
generation|поколение|The younger generation is different.|Младшее поколение другое.
ancestor|предок|My ancestors came from Poland.|Мои предки родом из Польши.
childhood|детство|I had a happy childhood.|У меня было счастливое детство.
upbringing|воспитание|She had a strict upbringing.|У неё было строгое воспитание.
raise|воспитывать; поднимать|She raised three kids alone.|Она одна вырастила троих детей.
get on with|ладить с|I get on well with my sister.|Я хорошо лажу с сестрой.
fall in love|влюбиться|They fell in love in Paris.|Они влюбились друг в друга в Париже.
break up|расстаться|They broke up last month.|Они расстались в прошлом месяце.
engaged|помолвленный|We got engaged!|Мы обручились!
date|свидание; дата|We went on a date.|Мы сходили на свидание.
trust|доверять; доверие|I trust you.|Я тебе доверяю.
loyal|верный, преданный|Dogs are very loyal.|Собаки очень преданные.
jealous|ревнивый, завистливый|He's jealous of his brother.|Он завидует брату.
acquaintance|знакомый|He's just an acquaintance.|Он просто знакомый.
community|сообщество|We have a strong community.|У нас сплочённое сообщество.
elderly|пожилой|We help elderly people.|Мы помогаем пожилым людям.
appearance|внешность|Don't judge by appearance.|Не суди по внешности.
attractive|привлекательный|She's very attractive.|Она очень привлекательная.
overweight|с лишним весом|The doctor said I'm overweight.|Врач сказал, у меня лишний вес.
bald|лысый|My dad is bald.|Мой папа лысый.
curly|кудрявый|She has curly hair.|У неё кудрявые волосы.
#B2:people
sibling|брат или сестра|Do you have any siblings?|У тебя есть братья или сёстры?
spouse|супруг(а)|Spouses are welcome.|Можно приходить с супругами.
peer|ровесник, сверстник|Teenagers care what their peers think.|Подросткам важно мнение сверстников.
bond|связь, узы|They have a strong bond.|У них крепкая связь.
offspring|потомство|Parents protect their offspring.|Родители защищают потомство.
mentor|наставник|She was my mentor at work.|Она была моей наставницей на работе.
#A1:health
body|тело|Exercise is good for your body.|Упражнения полезны для тела.
arm|рука (вся)|I broke my arm.|Я сломал руку.
leg|нога|My leg hurts.|У меня болит нога.
foot|ступня|My feet are cold.|У меня холодные ноги.
back|спина; назад|My back hurts.|У меня болит спина.
mouth|рот|Open your mouth.|Открой рот.
nose|нос|My nose is running.|У меня насморк.
ear|ухо|My ear hurts.|У меня болит ухо.
tooth|зуб|I have a bad tooth.|У меня болит зуб.
teeth|зубы|Brush your teeth.|Почисти зубы.
heart|сердце|Her heart is beating fast.|Её сердце быстро бьётся.
sick|больной; тошнит|I feel sick.|Меня тошнит.
medicine|лекарство|Take this medicine twice a day.|Принимай лекарство два раза в день.
sport|спорт|What sport do you do?|Каким спортом занимаешься?
football|футбол|Let's play football.|Давай сыграем в футбол.
#A2:health
finger|палец|I cut my finger.|Я порезал палец.
knee|колено|My knee hurts when I run.|Колено болит, когда бегаю.
shoulder|плечо|My shoulder hurts.|У меня болит плечо.
neck|шея|I have a stiff neck.|У меня затекла шея.
stomach|живот, желудок|I have a stomach ache.|У меня болит живот.
skin|кожа|She has beautiful skin.|У неё красивая кожа.
blood|кровь|He lost a lot of blood.|Он потерял много крови.
bone|кость|He broke a bone in his foot.|Он сломал кость в стопе.
brain|мозг|The brain needs sleep.|Мозгу нужен сон.
headache|головная боль|I have a terrible headache.|У меня ужасно болит голова.
flu|грипп|She's in bed with flu.|Она лежит с гриппом.
fever|температура, жар|He has a high fever.|У него высокая температура.
cough|кашель; кашлять|I have a bad cough.|У меня сильный кашель.
injury|травма|It's a serious injury.|Это серьёзная травма.
nurse|медсестра|The nurse gave me an injection.|Медсестра сделала мне укол.
dentist|стоматолог|I'm afraid of the dentist.|Я боюсь стоматолога.
appointment|запись (к врачу), встреча|I have a doctor's appointment.|У меня запись к врачу.
pill|таблетка|Take one pill before bed.|Принимай одну таблетку перед сном.
gym|спортзал|I go to the gym three times a week.|Я хожу в спортзал три раза в неделю.
exercise|упражнение; заниматься спортом|Exercise every day.|Занимайся спортом каждый день.
rest|отдых; отдыхать|You need some rest.|Тебе нужно отдохнуть.
weight|вес|I want to lose weight.|Хочу похудеть.
breathe|дышать|Breathe deeply.|Дыши глубоко.
smoke|курить; дым|He smokes too much.|Он слишком много курит.
alive|живой|Is it still alive?|Оно ещё живое?
dead|мёртвый; севший (о батарее)|My phone is dead.|У меня сел телефон.
#B1:health
symptom|симптом|What are your symptoms?|Какие у вас симптомы?
treatment|лечение|The treatment worked.|Лечение помогло.
cure|вылечить; лекарство (от болезни)|There's no cure for a cold.|От простуды нет лекарства.
recover|выздоравливать|She recovered quickly.|Она быстро поправилась.
prescription|рецепт (врача)|You need a prescription for this.|Для этого нужен рецепт.
surgery|операция; хирургия|He needs surgery.|Ему нужна операция.
disease|болезнь|Heart disease is common.|Болезни сердца распространены.
illness|болезнь (состояние)|After a long illness, he died.|Он умер после долгой болезни.
allergic|аллергический|I'm allergic to cats.|У меня аллергия на кошек.
infection|инфекция|It's a viral infection.|Это вирусная инфекция.
painkiller|обезболивающее|Take a painkiller.|Выпей обезболивающее.
sore|болящий, саднящий|I have a sore throat.|У меня болит горло.
dizzy|с кружащейся головой|I feel dizzy.|У меня кружится голова.
bleed|кровоточить|My nose is bleeding.|У меня кровь из носа.
swollen|опухший|My ankle is swollen.|У меня опухла лодыжка.
ambulance|скорая помощь|Call an ambulance!|Вызовите скорую!
emergency|экстренный случай|In case of emergency, call 112.|В экстренном случае звоните 112.
mental health|психическое здоровье|Mental health matters.|Психическое здоровье важно.
muscle|мышца|My muscles hurt after the gym.|После зала болят мышцы.
stretch|растягивать(ся)|Stretch before running.|Растянись перед бегом.
in shape|в форме|He's in great shape.|Он в отличной форме.
#B2:health
chronic|хронический|She has chronic back pain.|У неё хроническая боль в спине.
diagnosis|диагноз|The diagnosis was cancer.|Диагноз — рак.
side effect|побочный эффект|Are there any side effects?|Есть побочные эффекты?
immune system|иммунитет|Sleep strengthens the immune system.|Сон укрепляет иммунитет.
contagious|заразный|Is it contagious?|Это заразно?
heal|заживать, исцелять|The wound healed quickly.|Рана быстро зажила.
exhaustion|истощение|He collapsed from exhaustion.|Он упал от истощения.
burnout|выгорание|Burnout is common in IT.|Выгорание часто встречается в IT.
wellbeing|благополучие|We care about employee wellbeing.|Мы заботимся о благополучии сотрудников.
sedentary|сидячий|A sedentary lifestyle is dangerous.|Сидячий образ жизни опасен.
#A2:feel
excited|взволнованный (в радостном предвкушении)|I'm so excited about the trip!|Я так жду поездку!
bored|скучающий|I'm bored.|Мне скучно.
worried|обеспокоенный|I'm worried about you.|Я за тебя волнуюсь.
surprised|удивлённый|I was surprised to see him.|Я удивился, увидев его.
scared|испуганный|I'm scared of spiders.|Я боюсь пауков.
lonely|одинокий|I feel lonely sometimes.|Иногда мне одиноко.
glad|довольный, радый|I'm glad you came.|Рад, что ты пришёл.
calm|спокойный|Stay calm.|Сохраняй спокойствие.
shy|застенчивый|Don't be shy.|Не стесняйся.
brave|храбрый|You're very brave.|Ты очень храбрый.
clever|умный|She's a clever girl.|Она умная девочка.
stupid|глупый|That was a stupid mistake.|Это была глупая ошибка.
nice|приятный, милый|He's a nice guy.|Он приятный парень.
cheerful|жизнерадостный|She's always cheerful.|Она всегда весёлая.
hard-working|трудолюбивый|He's very hard-working.|Он очень трудолюбивый.
mood|настроение|I'm in a good mood.|У меня хорошее настроение.
feeling|чувство|I have a bad feeling about this.|У меня плохое предчувствие.
cry|плакать|Don't cry.|Не плачь.
fear|страх|He has a fear of flying.|Он боится летать.
fun|веселье; весёлый|Have fun!|Повеселись!
#B1:feel
annoyed|раздражённый|I'm annoyed with him.|Меня он раздражает.
frustrated|расстроенный (от бессилия)|I'm frustrated with my progress.|Меня бесит мой прогресс.
relieved|испытывающий облегчение|I'm so relieved!|Какое облегчение!
ashamed|пристыжённый|I'm ashamed of what I did.|Мне стыдно за то, что я сделал.
confused|сбитый с толку|I'm confused.|Я запутался.
satisfied|удовлетворённый|Are you satisfied with the result?|Ты доволен результатом?
thrilled|в восторге|I'm thrilled with my new job.|Я в восторге от новой работы.
terrified|в ужасе|I'm terrified of heights.|Я до ужаса боюсь высоты.
stressed|в стрессе|I'm really stressed.|У меня сильный стресс.
homesick|скучающий по дому|I felt homesick at first.|Сначала я скучал по дому.
selfish|эгоистичный|Don't be so selfish.|Не будь таким эгоистом.
stubborn|упрямый|He's as stubborn as a mule.|Он упрям как осёл.
ambitious|амбициозный|She's very ambitious.|Она очень амбициозная.
sensible|благоразумный|That's a sensible decision.|Это разумное решение.
sensitive|чувствительный|She's very sensitive.|Она очень ранимая.
mature|зрелый, взрослый|He's very mature for his age.|Он очень взрослый для своих лет.
optimistic|оптимистичный|I'm optimistic about the future.|Я смотрю в будущее с оптимизмом.
pessimistic|пессимистичный|Don't be so pessimistic.|Не будь таким пессимистом.
outgoing|общительный|She's very outgoing.|Она очень общительная.
moody|переменчивый (в настроении)|Teenagers are often moody.|У подростков часто меняется настроение.
anger|гнев|He couldn't control his anger.|Он не смог сдержать гнев.
joy|радость|She cried with joy.|Она плакала от радости.
pride|гордость|He spoke with pride.|Он говорил с гордостью.
sympathy|сочувствие|You have my sympathy.|Сочувствую.
#B2:feel
overwhelmed|подавленный, перегруженный|I feel overwhelmed at work.|Я завален работой и не справляюсь.
devastated|опустошённый, убитый горем|She was devastated by the news.|Новость её просто убила.
furious|в ярости|My boss was furious.|Начальник был в ярости.
content|довольный|I'm content with what I have.|Я доволен тем, что имею.
resilient|стойкий|Kids are very resilient.|Дети очень стойкие.
arrogant|высокомерный|He's arrogant and rude.|Он высокомерный и грубый.
humble|скромный|Despite his success, he's humble.|Несмотря на успех, он скромен.
empathy|эмпатия|Good leaders show empathy.|Хорошие лидеры проявляют эмпатию.
anxiety|тревожность|She suffers from anxiety.|Она страдает тревожностью.
gratitude|благодарность|I want to express my gratitude.|Хочу выразить благодарность.
#A1:travel
hotel|отель|We stayed in a nice hotel.|Мы жили в хорошем отеле.
airport|аэропорт|I'll take you to the airport.|Я отвезу тебя в аэропорт.
plane|самолёт|The plane is late.|Самолёт задерживается.
taxi|такси|Let's take a taxi.|Давай возьмём такси.
bike|велосипед|I ride my bike to work.|Я езжу на работу на велосипеде.
station|станция, вокзал|Where is the station?|Где вокзал?
road|дорога|The road is closed.|Дорога закрыта.
map|карта|Do you have a map?|У тебя есть карта?
left|левый; налево|Turn left.|Поверни налево.
near|рядом, близко|Is it near here?|Это рядом?
far|далеко|Is it far from here?|Это далеко отсюда?
bank|банк|The bank is closed.|Банк закрыт.
park|парк; парковать|Let's go to the park.|Пойдём в парк.
museum|музей|The museum is free on Sundays.|По воскресеньям музей бесплатный.
church|церковь|There's an old church in the village.|В деревне старая церковь.
bridge|мост|Walk across the bridge.|Пройди по мосту.
beach|пляж|We spent the day at the beach.|Мы провели день на пляже.
sea|море|I love swimming in the sea.|Обожаю плавать в море.
passport|паспорт|Don't forget your passport.|Не забудь паспорт.
suitcase|чемодан|My suitcase is too heavy.|Мой чемодан слишком тяжёлый.
visit|посещать; визит|I want to visit London.|Я хочу посетить Лондон.
#A2:travel
flight|рейс, перелёт|Our flight is at 6 am.|Наш рейс в 6 утра.
luggage|багаж|Where can I leave my luggage?|Где можно оставить багаж?
platform|платформа|The train leaves from platform 3.|Поезд отходит с платформы 3.
underground|метро|Let's take the underground.|Поедем на метро.
traffic|движение, пробки|There's a lot of traffic today.|Сегодня большие пробки.
traffic lights|светофор|Stop at the traffic lights.|Остановись на светофоре.
corner|угол|The shop is on the corner.|Магазин на углу.
crossroads|перекрёсток|Turn left at the crossroads.|На перекрёстке налево.
straight on|прямо|Go straight on.|Идите прямо.
opposite|напротив|The bank is opposite the station.|Банк напротив вокзала.
next to|рядом с|The cafe is next to the cinema.|Кафе рядом с кинотеатром.
behind|позади, за|The car park is behind the hotel.|Парковка за отелем.
in front of|перед|Wait in front of the school.|Жди перед школой.
square|площадь; квадрат|Let's meet in the main square.|Встретимся на главной площади.
tourist|турист|The city is full of tourists.|В городе полно туристов.
guide|гид; путеводитель|Our guide was great.|Наш гид был отличный.
sightseeing|осмотр достопримечательностей|We went sightseeing.|Мы осматривали достопримечательности.
souvenir|сувенир|I bought some souvenirs.|Я купил сувениры.
reception|ресепшн|Ask at reception.|Спросите на ресепшене.
reservation|бронирование|I have a reservation.|У меня бронь.
single room|одноместный номер|A single room, please.|Одноместный номер, пожалуйста.
double room|номер с двуспальной кроватью|We'd like a double room.|Нам номер с двуспальной кроватью.
check in|регистрироваться, заселяться|We checked in at 3 pm.|Мы заселились в 3 часа дня.
check out|выписываться, выезжать|What time is check-out?|Во сколько выезд?
departure|отправление|Departure is at 10:30.|Отправление в 10:30.
arrival|прибытие|Arrivals are on the ground floor.|Зона прилёта на первом этаже.
delay|задержка; задерживать|The flight is delayed.|Рейс задерживается.
cancel|отменять|They cancelled the flight.|Рейс отменили.
catch|успеть на; ловить|I need to catch the 8 o'clock train.|Мне надо успеть на поезд в 8.
get on|садиться (в транспорт)|Get on the bus here.|Садись на автобус здесь.
get off|выходить (из транспорта)|Get off at the next stop.|Выходи на следующей остановке.
stop|остановка; останавливать|Where's the bus stop?|Где автобусная остановка?
return ticket|билет туда и обратно|A return ticket to Oxford, please.|Билет до Оксфорда туда и обратно, пожалуйста.
one-way|в одну сторону|A one-way ticket, please.|Билет в одну сторону, пожалуйста.
lost|потерявшийся|I think we're lost.|Кажется, мы заблудились.
embassy|посольство|Go to the embassy.|Обратитесь в посольство.
visa|виза|Do I need a visa?|Мне нужна виза?
border|граница|We crossed the border at night.|Мы пересекли границу ночью.
capital|столица|Paris is the capital of France.|Париж — столица Франции.
town|городок|I grew up in a small town.|Я вырос в маленьком городке.
building|здание|It's the tallest building in the city.|Это самое высокое здание в городе.
tower|башня|The tower is 300 metres tall.|Башня высотой 300 метров.
castle|замок|We visited an old castle.|Мы посетили старый замок.
pavement|тротуар|Walk on the pavement.|Иди по тротуару.
petrol|бензин|We're running out of petrol.|У нас кончается бензин.
#B1:travel
destination|место назначения|What's your final destination?|Какой ваш конечный пункт?
accommodation|жильё (при поездке)|Accommodation is expensive here.|Жильё здесь дорогое.
itinerary|маршрут, план поездки|Here's our itinerary.|Вот наш маршрут.
landmark|достопримечательность, ориентир|The Eiffel Tower is a famous landmark.|Эйфелева башня — знаменитая достопримечательность.
crowded|переполненный|The metro is crowded in the morning.|Утром в метро толпа.
breathtaking|захватывающий дух|The view was breathtaking.|Вид захватывал дух.
off the beaten track|вдали от туристических троп|We like places off the beaten track.|Мы любим нетуристические места.
commute|дорога на работу; ездить на работу|My commute takes an hour.|Дорога на работу занимает час.
rush hour|час пик|Avoid travelling in rush hour.|Не езди в час пик.
traffic jam|пробка|We were stuck in a traffic jam.|Мы застряли в пробке.
fare|стоимость проезда|How much is the fare?|Сколько стоит проезд?
connection|пересадка; связь|I missed my connection.|Я опоздал на пересадку.
jet lag|джетлаг|I have terrible jet lag.|У меня ужасный джетлаг.
customs|таможня|We went through customs.|Мы прошли таможню.
boarding pass|посадочный талон|Show your boarding pass.|Покажите посадочный талон.
aisle|проход (в самолёте)|Window or aisle seat?|Место у окна или у прохода?
backpack|рюкзак|I travel with just a backpack.|Я путешествую только с рюкзаком.
hitchhike|ездить автостопом|We hitchhiked across Europe.|Мы проехали Европу автостопом.
explore|исследовать|Let's explore the old town.|Давай исследуем старый город.
local|местный; местный житель|Ask the locals.|Спроси местных.
suburbs|пригород|We live in the suburbs.|Мы живём в пригороде.
outskirts|окраина|The hotel is on the outskirts.|Отель на окраине.
#B2:travel
wanderlust|страсть к путешествиям|I've always had wanderlust.|Меня всегда тянуло путешествовать.
layover|пересадка (с ожиданием)|We have a six-hour layover in Dubai.|У нас пересадка шесть часов в Дубае.
picturesque|живописный|It's a picturesque village.|Это живописная деревня.
remote|отдалённый; удалённый|They live in a remote area.|Они живут в глуши.
infrastructure|инфраструктура|The city's infrastructure is old.|Инфраструктура города старая.
#A1:nature
sun|солнце|The sun is shining.|Светит солнце.
rain|дождь; идти (о дожде)|It's raining.|Идёт дождь.
snow|снег|We had a lot of snow this year.|В этом году было много снега.
wind|ветер|The wind is very strong.|Ветер очень сильный.
sky|небо|The sky is clear.|Небо ясное.
tree|дерево|There's an old tree in the garden.|В саду старое дерево.
flower|цветок|She bought me flowers.|Она купила мне цветы.
river|река|We swam in the river.|Мы купались в реке.
mountain|гора|We climbed a mountain.|Мы поднялись на гору.
animal|животное|What's your favourite animal?|Какое твоё любимое животное?
bird|птица|Birds are singing.|Поют птицы.
horse|лошадь|Can you ride a horse?|Ты умеешь ездить верхом?
summer|лето|We go to the sea every summer.|Каждое лето мы ездим на море.
winter|зима|Winters here are very cold.|Зимы здесь очень холодные.
spring|весна|Spring is coming.|Скоро весна.
autumn|осень|I love autumn.|Люблю осень.
warm|тёплый|It's warm today.|Сегодня тепло.
sunny|солнечный|It's a sunny day.|Солнечный день.
#A2:nature
cloud|облако|There isn't a cloud in the sky.|На небе ни облачка.
cloudy|облачный|It's cloudy today.|Сегодня облачно.
windy|ветреный|It's very windy outside.|На улице очень ветрено.
foggy|туманный|It's foggy this morning.|Утром туман.
storm|буря, гроза|There was a storm last night.|Ночью была гроза.
temperature|температура|The temperature is minus ten.|Минус десять.
degree|градус; степень|It's 30 degrees today.|Сегодня 30 градусов.
forest|лес|We walked in the forest.|Мы гуляли в лесу.
lake|озеро|They have a house by the lake.|У них дом у озера.
island|остров|We spent a week on an island.|Мы провели неделю на острове.
hill|холм|The house is on a hill.|Дом на холме.
field|поле|Cows in the field.|Коровы в поле.
grass|трава|Don't walk on the grass.|Не ходите по траве.
plant|растение; сажать|Water the plants.|Полей растения.
leaf|лист|The leaves are turning yellow.|Листья желтеют.
stone|камень|He threw a stone.|Он бросил камень.
ocean|океан|The Pacific Ocean.|Тихий океан.
coast|побережье|We drove along the coast.|Мы ехали вдоль побережья.
wild|дикий|Wild animals.|Дикие животные.
insect|насекомое|I hate insects.|Ненавижу насекомых.
cow|корова|The cow gives milk.|Корова даёт молоко.
sheep|овца|There are sheep in the field.|В поле овцы.
pig|свинья|Pigs are clever animals.|Свиньи — умные животные.
wolf|волк|We heard a wolf.|Мы слышали волка.
bear|медведь|There are bears in this forest.|В этом лесу водятся медведи.
earth|земля, Земля|The Earth goes around the Sun.|Земля вращается вокруг Солнца.
moon|луна|The moon is full tonight.|Сегодня полнолуние.
star|звезда|Look at the stars!|Посмотри на звёзды!
ice|лёд|Be careful, there's ice on the road.|Осторожно, на дороге лёд.
#B1:nature
climate|климат|The climate is changing.|Климат меняется.
forecast|прогноз|What's the weather forecast?|Какой прогноз погоды?
freezing|ледяной, морозный|It's freezing outside!|На улице мороз!
humid|влажный|It's very humid in summer.|Летом очень влажно.
thunder|гром|I heard thunder.|Я слышал гром.
lightning|молния|Lightning hit the tree.|В дерево ударила молния.
flood|наводнение|The flood destroyed many homes.|Наводнение разрушило много домов.
drought|засуха|There's been a drought for months.|Засуха длится месяцами.
earthquake|землетрясение|There was a strong earthquake.|Было сильное землетрясение.
wildlife|дикая природа|The area is rich in wildlife.|Здесь богатая дикая природа.
species|вид (биол.)|This species is endangered.|Этот вид под угрозой исчезновения.
pollution|загрязнение|Air pollution is a big problem.|Загрязнение воздуха — большая проблема.
recycle|перерабатывать|We recycle plastic.|Мы сдаём пластик на переработку.
desert|пустыня|The Sahara is a huge desert.|Сахара — огромная пустыня.
valley|долина|A green valley.|Зелёная долина.
cave|пещера|We explored a cave.|Мы исследовали пещеру.
#B2:nature
global warming|глобальное потепление|Global warming affects us all.|Глобальное потепление касается всех.
renewable|возобновляемый|Renewable energy is the future.|Будущее за возобновляемой энергией.
emissions|выбросы|We must cut carbon emissions.|Надо сократить выбросы углерода.
endangered|находящийся под угрозой|Tigers are endangered.|Тигры под угрозой исчезновения.
sustainable|устойчивый, экологичный|We need sustainable solutions.|Нужны экологичные решения.
habitat|среда обитания|They're destroying the animals' habitat.|Они разрушают среду обитания животных.
#A1:work
office|офис|I work in an office.|Я работаю в офисе.
worker|работник|Factory workers.|Рабочие завода.
manager|менеджер, руководитель|I want to speak to the manager.|Я хочу поговорить с менеджером.
email|электронное письмо|Send me an email.|Пришли мне письмо.
dollar|доллар|It costs ten dollars.|Это стоит десять долларов.
cost|стоить; стоимость|How much does it cost?|Сколько это стоит?
#A2:work
interview|собеседование, интервью|I have a job interview tomorrow.|Завтра у меня собеседование.
employee|сотрудник|The company has 200 employees.|В компании 200 сотрудников.
employer|работодатель|My employer pays well.|Мой работодатель хорошо платит.
staff|персонал|The staff are very friendly.|Персонал очень дружелюбный.
team|команда|We're a great team.|Мы отличная команда.
project|проект|I'm working on a new project.|Я работаю над новым проектом.
report|отчёт; сообщать|I need to finish this report.|Мне надо закончить этот отчёт.
contract|контракт|Sign the contract.|Подпишите контракт.
deadline|крайний срок, дедлайн|The deadline is Friday.|Дедлайн — пятница.
business|бизнес; дело|He runs his own business.|У него свой бизнес.
factory|завод, фабрика|My dad works in a factory.|Мой папа работает на заводе.
lawyer|юрист|You need a lawyer.|Тебе нужен юрист.
engineer|инженер|She's an engineer.|Она инженер.
pilot|пилот|He wants to be a pilot.|Он хочет стать пилотом.
police officer|полицейский|Ask a police officer.|Спроси полицейского.
shop assistant|продавец|She works as a shop assistant.|Она работает продавцом.
unemployed|безработный|He's been unemployed for a year.|Он без работы уже год.
retire|уходить на пенсию|My dad retired last year.|Папа вышел на пенсию в прошлом году.
pension|пенсия|The pension is very small.|Пенсия очень маленькая.
part-time|неполный рабочий день|I work part-time.|Я работаю на полставки.
full-time|полный рабочий день|It's a full-time job.|Это работа на полный день.
wage|зарплата (почасовая)|The minimum wage went up.|МРОТ повысили.
tax|налог|We pay a lot of tax.|Мы платим много налогов.
coin|монета|I need some coins for parking.|Мне нужны монеты на парковку.
wallet|кошелёк|I lost my wallet.|Я потерял кошелёк.
account|счёт (банковский); аккаунт|I opened a bank account.|Я открыл счёт в банке.
loan|кредит, заём|I took out a loan.|Я взял кредит.
owe|быть должным|You owe me ten dollars.|Ты мне должен десять долларов.
cheque|чек (банковский)|Can I pay by cheque?|Можно оплатить чеком?
hire|нанимать; брать напрокат|We need to hire more people.|Нам нужно нанять больше людей.
fire|увольнять; огонь|He was fired.|Его уволили.
quit|бросить, уволиться|She quit her job.|Она уволилась.
promotion|повышение|I got a promotion!|Меня повысили!
CV|резюме|Send us your CV.|Пришлите резюме.
#B1:work
application|заявление, заявка; приложение|Fill in the application form.|Заполните форму заявки.
candidate|кандидат|We have three candidates.|У нас три кандидата.
qualification|квалификация, диплом|What qualifications do you have?|Какая у вас квалификация?
position|должность; положение|I applied for the position of manager.|Я подал заявку на должность менеджера.
duty|обязанность; долг|What are your main duties?|Каковы ваши основные обязанности?
schedule|расписание, график|I have a busy schedule.|У меня плотный график.
shift|смена|I work night shifts.|Я работаю в ночные смены.
overtime|сверхурочные|I worked overtime all week.|Я всю неделю работал сверхурочно.
client|клиент|We have a meeting with a client.|У нас встреча с клиентом.
negotiate|вести переговоры|We negotiated a better price.|Мы выторговали цену получше.
profit|прибыль|The company made a profit.|Компания получила прибыль.
loss|убыток; потеря|They made a loss this year.|В этом году у них убыток.
budget|бюджет|We're over budget.|Мы вышли за рамки бюджета.
invest|инвестировать|He invested in property.|Он вложился в недвижимость.
investment|инвестиция|It's a good investment.|Это хорошее вложение.
savings|сбережения|I spent all my savings.|Я потратил все сбережения.
expenses|расходы|Travel expenses are covered.|Дорожные расходы оплачиваются.
industry|отрасль, промышленность|The car industry.|Автомобильная промышленность.
competition|конкуренция; соревнование|There's a lot of competition.|Большая конкуренция.
product|продукт, товар|We launched a new product.|Мы запустили новый продукт.
service|услуга, обслуживание|The service was excellent.|Обслуживание было отличным.
advertising|реклама|They spend millions on advertising.|Они тратят миллионы на рекламу.
earnings|заработок|His earnings doubled.|Его заработок удвоился.
resign|уходить в отставку, увольняться|The director resigned.|Директор ушёл в отставку.
freelance|фриланс; внештатный|I work freelance.|Я работаю на фрилансе.
remote work|удалённая работа|Remote work saves time.|Удалёнка экономит время.
#B2:work
revenue|выручка, доход|Revenue grew by 20%.|Выручка выросла на 20%.
turnover|оборот; текучка|Staff turnover is high.|Текучка кадров высокая.
stakeholder|заинтересованная сторона|We need to inform all stakeholders.|Нужно проинформировать все заинтересованные стороны.
entrepreneur|предприниматель|He's a successful entrepreneur.|Он успешный предприниматель.
startup|стартап|She works at a tech startup.|Она работает в технологическом стартапе.
recruit|нанимать, набирать|We're recruiting developers.|Мы набираем разработчиков.
appraisal|оценка (работы сотрудника)|I have my annual appraisal next week.|На следующей неделе у меня ежегодная аттестация.
merger|слияние (компаний)|The merger was announced today.|О слиянии объявили сегодня.
asset|актив; ценное качество|She's a real asset to the team.|Она настоящая находка для команды.
inflation|инфляция|Inflation is rising.|Инфляция растёт.
recession|рецессия, спад|The economy is in recession.|Экономика в рецессии.
outsource|передавать на аутсорс|We outsource IT support.|Мы отдаём ИТ-поддержку на аутсорс.
#A1:fun
game|игра|Let's play a game.|Давай сыграем в игру.
song|песня|I love this song.|Обожаю эту песню.
dance|танцевать; танец|Do you want to dance?|Хочешь потанцевать?
sing|петь|She sings beautifully.|Она прекрасно поёт.
party|вечеринка|Come to my party!|Приходи на мою вечеринку!
cinema|кинотеатр|Let's go to the cinema.|Пойдём в кино.
photo|фото|Can I take a photo?|Можно сфотографировать?
hobby|хобби|What are your hobbies?|Какие у тебя хобби?
weekend|выходные|What are you doing at the weekend?|Что делаешь на выходных?
free time|свободное время|What do you do in your free time?|Чем занимаешься в свободное время?
#A2:fun
concert|концерт|We went to a concert.|Мы ходили на концерт.
band|группа (музыкальная)|My favourite band is Muse.|Моя любимая группа — Muse.
guitar|гитара|He plays the guitar.|Он играет на гитаре.
piano|пианино|She plays the piano.|Она играет на пианино.
theatre|театр|We went to the theatre.|Мы ходили в театр.
series|сериал|I'm watching a new series.|Я смотрю новый сериал.
episode|серия, эпизод|One more episode!|Ещё одну серию!
actor|актёр|He's a famous actor.|Он знаменитый актёр.
singer|певец|She's a great singer.|Она прекрасная певица.
artist|художник|My sister is an artist.|Моя сестра — художница.
painting|картина; живопись|A beautiful painting.|Красивая картина.
draw|рисовать|My son loves to draw.|Мой сын любит рисовать.
novel|роман|I'm reading a novel.|Я читаю роман.
story|история, рассказ|Tell me a story.|Расскажи историю.
magazine|журнал|I read it in a magazine.|Я прочитал это в журнале.
newspaper|газета|My dad reads the newspaper.|Мой папа читает газету.
camera|фотоаппарат, камера|I bought a new camera.|Я купил новую камеру.
fishing|рыбалка|My grandpa loves fishing.|Мой дедушка обожает рыбалку.
camping|кемпинг, поход с палатками|We went camping.|Мы ходили в поход с палатками.
cycling|езда на велосипеде|Cycling is good exercise.|Велосипед — хорошая нагрузка.
running|бег|I go running every morning.|Я бегаю каждое утро.
match|матч|Did you watch the match?|Ты смотрел матч?
player|игрок|He's the best player.|Он лучший игрок.
score|счёт; забивать|What's the score?|Какой счёт?
festival|фестиваль|We went to a music festival.|Мы ездили на музыкальный фестиваль.
relax|расслабляться|I just want to relax.|Я просто хочу расслабиться.
#B1:fun
audience|зрители, аудитория|The audience loved it.|Зрителям понравилось.
performance|выступление|What a great performance!|Какое отличное выступление!
plot|сюжет|The plot is very complicated.|Сюжет очень запутанный.
character|персонаж; характер|Who's your favourite character?|Кто твой любимый персонаж?
director|режиссёр; директор|Who's the director of the film?|Кто режиссёр фильма?
review|отзыв, рецензия|The film got great reviews.|У фильма отличные отзывы.
subtitles|субтитры|Watch it with English subtitles.|Смотри с английскими субтитрами.
genre|жанр|What genre of music do you like?|Какой жанр музыки ты любишь?
exhibition|выставка|There's a new exhibition at the museum.|В музее новая выставка.
gallery|галерея|An art gallery.|Художественная галерея.
lyrics|текст песни|I don't understand the lyrics.|Я не понимаю текст песни.
binge-watch|смотреть запоем|I binge-watched the whole series.|Я посмотрел весь сериал запоем.
spoiler|спойлер|No spoilers, please!|Без спойлеров, пожалуйста!
trailer|трейлер|Have you seen the trailer?|Ты видел трейлер?
board game|настольная игра|We play board games on Fridays.|По пятницам мы играем в настолки.
compete|соревноваться|Ten teams will compete.|Будут соревноваться десять команд.
champion|чемпион|He's the world champion.|Он чемпион мира.
coach|тренер|Our coach is very strict.|Наш тренер очень строгий.
#B2:fun
masterpiece|шедевр|This film is a masterpiece.|Этот фильм — шедевр.
sequel|продолжение (фильма, книги)|The sequel is even better.|Продолжение даже лучше.
cast|актёрский состав|The cast is amazing.|Актёрский состав потрясающий.
critic|критик|Critics hated the film.|Критики разгромили фильм.
entertaining|развлекательный, занятный|It's not deep, but it's entertaining.|Неглубоко, но занятно.
gripping|захватывающий|A gripping thriller.|Захватывающий триллер.
#A1:study
class|урок; класс|My class starts at nine.|Мой урок начинается в девять.
lesson|урок|Today's lesson is about verbs.|Сегодняшний урок — про глаголы.
homework|домашнее задание|Did you do your homework?|Ты сделал домашку?
test|тест, контрольная|I have a test tomorrow.|Завтра у меня контрольная.
exam|экзамен|I passed the exam!|Я сдал экзамен!
pen|ручка|Can I borrow your pen?|Можно взять твою ручку?
pencil|карандаш|Write it in pencil.|Напиши карандашом.
paper|бумага|A piece of paper.|Листок бумаги.
page|страница|Open your books at page ten.|Откройте книги на странице десять.
letter|письмо; буква|There are 26 letters in the English alphabet.|В английском алфавите 26 букв.
number|число, номер|What's your phone number?|Какой у тебя номер телефона?
English|английский язык|I'm learning English.|Я учу английский.
university|университет|She studies at university.|Она учится в университете.
study|учиться, изучать|I study every day.|Я занимаюсь каждый день.
#A2:study
subject|предмет|Maths is my favourite subject.|Математика — мой любимый предмет.
maths|математика|I was bad at maths.|Я был слаб в математике.
history|история|I love history.|Я люблю историю.
science|наука|Science is changing the world.|Наука меняет мир.
geography|география|We have geography on Monday.|В понедельник у нас география.
dictionary|словарь|Look it up in the dictionary.|Посмотри в словаре.
grammar|грамматика|English grammar isn't so hard.|Английская грамматика не такая уж трудная.
vocabulary|словарный запас|I want to improve my vocabulary.|Хочу расширить словарный запас.
pronunciation|произношение|Her pronunciation is perfect.|У неё идеальное произношение.
sentence|предложение|Write a sentence with this word.|Составь предложение с этим словом.
spell|писать по буквам|How do you spell your name?|Как пишется твоё имя?
translate|переводить|Can you translate this?|Можешь перевести это?
practise|практиковаться|Practise every day.|Практикуйся каждый день.
revise|повторять (к экзамену)|I'm revising for my exams.|Я готовлюсь к экзаменам.
mark|оценка; отмечать|I got a good mark.|Я получил хорошую оценку.
course|курс|I'm doing an English course.|Я прохожу курс английского.
uniform|форма|Students wear uniforms.|Ученики носят форму.
library|библиотека|I study in the library.|Я занимаюсь в библиотеке.
cheat|списывать, жульничать|He cheated in the exam.|Он списал на экзамене.
knowledge|знания|Knowledge is power.|Знание — сила.
#B1:study
education|образование|Education should be free.|Образование должно быть бесплатным.
lecture|лекция|The lecture starts at ten.|Лекция начинается в десять.
lecturer|преподаватель (вуза)|Our lecturer is brilliant.|Наш преподаватель блестящий.
essay|эссе, сочинение|Write an essay of 300 words.|Напиши эссе на 300 слов.
assignment|задание|I have an assignment due tomorrow.|Завтра сдавать задание.
term|семестр; срок|The new term starts in September.|Новый семестр начинается в сентябре.
graduate|окончить (вуз); выпускник|I graduated in 2019.|Я окончил вуз в 2019 году.
scholarship|стипендия|She got a scholarship to Oxford.|Она получила стипендию в Оксфорд.
fluent|свободно говорящий|She's fluent in English.|Она свободно говорит по-английски.
accent|акцент|He has a strong accent.|У него сильный акцент.
memorise|заучивать наизусть|I memorised 20 words today.|Сегодня я выучил 20 слов.
concentrate|сосредоточиться|I can't concentrate.|Не могу сосредоточиться.
experiment|эксперимент|We did an experiment.|Мы провели эксперимент.
theory|теория|In theory, it should work.|Теоретически, должно работать.
discover|открывать, обнаруживать|Who discovered penicillin?|Кто открыл пенициллин?
invent|изобретать|Who invented the telephone?|Кто изобрёл телефон?
scientist|учёный|Scientists found a new species.|Учёные нашли новый вид.
textbook|учебник|Open your textbooks.|Откройте учебники.
#B2:study
curriculum|учебная программа|The school curriculum is outdated.|Школьная программа устарела.
thesis|диссертация, дипломная работа|I'm writing my thesis.|Я пишу диплом.
academic|академический|Academic writing is formal.|Академическое письмо формальное.
literacy|грамотность|Financial literacy is important.|Финансовая грамотность важна.
proficiency|владение (навыком)|English proficiency is required.|Требуется уверенное владение английским.
hypothesis|гипотеза|We tested the hypothesis.|Мы проверили гипотезу.
#A2:tech
internet|интернет|The internet is down.|Интернет не работает.
website|сайт|Visit our website.|Заходите на наш сайт.
app|приложение|Download the app.|Скачай приложение.
laptop|ноутбук|I work on my laptop.|Я работаю на ноутбуке.
screen|экран|My phone screen is broken.|У меня разбит экран телефона.
password|пароль|I forgot my password.|Я забыл пароль.
message|сообщение|I sent you a message.|Я отправил тебе сообщение.
text|писать сообщение|Text me when you arrive.|Напиши, когда приедешь.
download|скачивать|Download the file.|Скачай файл.
upload|загружать (в сеть)|Upload your photo.|Загрузи своё фото.
click|нажимать (мышью)|Click here.|Нажми здесь.
battery|батарея, аккумулятор|My battery is low.|У меня садится батарея.
charger|зарядка|Can I borrow your charger?|Можно взять твою зарядку?
video|видео|Watch this video.|Посмотри это видео.
social media|соцсети|I spend too much time on social media.|Я слишком много сижу в соцсетях.
#B1:tech
device|устройство|Turn off all devices.|Выключите все устройства.
software|программное обеспечение|Update the software.|Обновите программу.
update|обновление; обновлять|Install the latest update.|Установи последнее обновление.
install|устанавливать|Install the app on your phone.|Установи приложение на телефон.
delete|удалять|I deleted the photos by mistake.|Я случайно удалил фото.
search|искать; поиск|Search for it online.|Поищи это в интернете.
browser|браузер|Open it in your browser.|Открой в браузере.
log in|входить (в аккаунт)|I can't log in.|Не могу войти.
settings|настройки|Go to settings.|Зайди в настройки.
notification|уведомление|Turn off notifications.|Отключи уведомления.
wireless|беспроводной|Wireless headphones.|Беспроводные наушники.
headphones|наушники|Put on your headphones.|Надень наушники.
crash|зависнуть, упасть (о программе)|My computer crashed.|У меня завис компьютер.
virus|вирус|My laptop has a virus.|На ноутбуке вирус.
hacker|хакер|Hackers stole the data.|Хакеры украли данные.
data|данные|Protect your data.|Защищай свои данные.
smartphone|смартфон|Everyone has a smartphone.|У всех есть смартфон.
post|публиковать; пост|She posted a photo.|Она выложила фото.
follower|подписчик|He has a million followers.|У него миллион подписчиков.
#B2:tech
artificial intelligence|искусственный интеллект|Artificial intelligence is changing jobs.|ИИ меняет профессии.
algorithm|алгоритм|The algorithm decides what you see.|Алгоритм решает, что ты видишь.
privacy|конфиденциальность|Online privacy is important.|Конфиденциальность в сети важна.
cyber security|кибербезопасность|Cyber security is a growing field.|Кибербезопасность — растущая сфера.
user-friendly|удобный для пользователя|The app is very user-friendly.|Приложение очень удобное.
cutting-edge|передовой|Cutting-edge technology.|Передовые технологии.
automation|автоматизация|Automation will replace some jobs.|Автоматизация заменит часть профессий.
digital|цифровой|We live in a digital world.|Мы живём в цифровом мире.
#A2:society
government|правительство|The government raised taxes.|Правительство подняло налоги.
president|президент|The president gave a speech.|Президент выступил с речью.
police|полиция|Call the police!|Вызовите полицию!
army|армия|He served in the army.|Он служил в армии.
war|война|The war lasted four years.|Война длилась четыре года.
peace|мир (не война)|We want peace.|Мы хотим мира.
crime|преступление|Crime is rising.|Преступность растёт.
thief|вор|The thief was caught.|Вора поймали.
prison|тюрьма|He went to prison.|Он сел в тюрьму.
religion|религия|Religion is a personal matter.|Религия — личное дело.
vote|голосовать; голос|Did you vote?|Ты голосовал?
#B1:society
politics|политика|I'm not interested in politics.|Меня не интересует политика.
election|выборы|The election is next month.|Выборы в следующем месяце.
politician|политик|Politicians make promises.|Политики дают обещания.
citizen|гражданин|He's a Russian citizen.|Он гражданин России.
population|население|The population is growing.|Население растёт.
economy|экономика|The economy is growing.|Экономика растёт.
poverty|бедность|Millions live in poverty.|Миллионы живут в бедности.
unemployment|безработица|Unemployment is high.|Безработица высокая.
protest|протест; протестовать|There was a protest in the centre.|В центре была акция протеста.
rights|права|Human rights.|Права человека.
court|суд|The case went to court.|Дело дошло до суда.
judge|судья; судить|The judge sentenced him to five years.|Судья приговорил его к пяти годам.
innocent|невиновный|I'm innocent!|Я невиновен!
arrest|арестовывать|The police arrested him.|Полиция его арестовала.
victim|жертва|The victim was a young woman.|Жертвой стала молодая женщина.
witness|свидетель|Were there any witnesses?|Были свидетели?
violence|насилие|Violence is never the answer.|Насилие — не выход.
headline|заголовок|Did you see today's headlines?|Видел сегодняшние заголовки?
journalist|журналист|She's a journalist.|Она журналистка.
charity|благотворительность|I give money to charity.|Я жертвую на благотворительность.
volunteer|волонтёр|She volunteers at a shelter.|Она волонтёрит в приюте.
#B2:society
democracy|демократия|Democracy needs free elections.|Демократии нужны свободные выборы.
legislation|законодательство|New legislation was passed.|Приняли новый закон.
corruption|коррупция|Corruption is a huge problem.|Коррупция — огромная проблема.
inequality|неравенство|Income inequality is growing.|Неравенство доходов растёт.
immigration|иммиграция|Immigration is a hot topic.|Иммиграция — острая тема.
refugee|беженец|Thousands of refugees crossed the border.|Тысячи беженцев пересекли границу.
campaign|кампания|An election campaign.|Предвыборная кампания.
policy|политика (курс), правила|Company policy doesn't allow it.|Правила компании это запрещают.
controversial|спорный, вызывающий споры|It's a controversial decision.|Это спорное решение.
welfare|соцобеспечение; благополучие|The welfare system.|Система соцобеспечения.
#A1:verbs
say|сказать|What did you say?|Что ты сказал?
take|брать; занимать (время)|It takes ten minutes.|Это занимает десять минут.
listen|слушать|Listen to me!|Послушай меня!
stay|оставаться|Stay here.|Оставайся здесь.
fly|летать|We fly to Rome tomorrow.|Завтра летим в Рим.
ride|ездить (верхом, на велосипеде)|I ride my bike every day.|Я катаюсь на велосипеде каждый день.
climb|лезть, подниматься|We climbed to the top.|Мы забрались на вершину.
jump|прыгать|The cat jumped on the table.|Кот запрыгнул на стол.
count|считать|Count to ten.|Посчитай до десяти.
#A2:verbs
break|ломать|I broke my phone.|Я сломал телефон.
build|строить|They're building a new school.|Строят новую школу.
hold|держать|Hold my hand.|Держи меня за руку.
hang|вешать, висеть|Hang your coat here.|Повесь пальто здесь.
hide|прятать(ся)|The cat is hiding under the bed.|Кот прячется под кроватью.
kick|пинать|He kicked the ball.|Он пнул мяч.
knock|стучать|Knock on the door.|Постучи в дверь.
lock|запирать; замок|Lock the door.|Запри дверь.
pick|выбирать; собирать|Pick a card.|Выбери карту.
point|указывать; смысл|Don't point at people.|Не показывай на людей пальцем.
press|нажимать|Press the green button.|Нажми зелёную кнопку.
ring|звонить; кольцо|The phone is ringing.|Звонит телефон.
rise|подниматься|Prices are rising.|Цены растут.
shake|трясти|Shake the bottle.|Взболтай бутылку.
shout|кричать|Don't shout at me!|Не кричи на меня!
shut|закрывать|Shut the door.|Закрой дверь.
sign|подписывать; знак|Sign here, please.|Подпишите здесь, пожалуйста.
throw away|выбрасывать|Don't throw it away.|Не выбрасывай это.
touch|трогать|Don't touch it!|Не трогай!
turn|поворачивать(ся); очередь|It's your turn.|Твоя очередь.
turn on|включать|Turn on the light.|Включи свет.
turn off|выключать|Turn off your phone.|Выключи телефон.
wake|будить|Don't wake the baby.|Не разбуди малыша.
wish|желать; желание|I wish you luck.|Желаю тебе удачи.
wonder|интересоваться, задаваться вопросом|I wonder why he left.|Интересно, почему он ушёл.
cover|покрывать, накрывать|Cover the pot.|Накрой кастрюлю.
drop|ронять|I dropped my keys.|Я уронил ключи.
fight|драться, бороться|Stop fighting!|Хватит драться!
feed|кормить|Feed the cat.|Покорми кошку.
fix|чинить|Can you fix it?|Можешь починить?
guess|угадывать; полагать|Guess what!|Угадай что!
hit|ударять|He hit his head.|Он ударился головой.
kiss|целовать|She kissed him.|Она его поцеловала.
hug|обнимать|Give me a hug.|Обними меня.
pack|собирать вещи, упаковывать|Pack your bags.|Собирай вещи.
paint|красить, рисовать красками|We painted the walls white.|Мы покрасили стены в белый.
belong|принадлежать|This bag belongs to me.|Эта сумка моя.
continue|продолжать|Please continue.|Продолжайте, пожалуйста.
destroy|разрушать|The fire destroyed the house.|Пожар уничтожил дом.
kill|убивать|Smoking kills.|Курение убивает.
let go|отпускать|Let go of my hand!|Отпусти мою руку!
measure|измерять|Measure the room.|Измерь комнату.
#B1:verbs
accept|принимать, соглашаться|I accept your offer.|Я принимаю твоё предложение.
add|добавлять|Add some salt.|Добавь соли.
announce|объявлять|They announced the winner.|Объявили победителя.
arrange|устраивать, организовывать|I'll arrange a meeting.|Я организую встречу.
attach|прикреплять|I've attached the file.|Я прикрепил файл.
attend|посещать (мероприятие)|I attended the conference.|Я был на конференции.
bend|сгибать(ся)|Bend your knees.|Согни колени.
bother|беспокоить|Sorry to bother you.|Извините за беспокойство.
calculate|вычислять|Calculate the total cost.|Посчитай общую стоимость.
celebrate|праздновать|Let's celebrate!|Давай отпразднуем!
collect|собирать, забирать|I'll collect you at six.|Я заберу тебя в шесть.
combine|сочетать, объединять|Combine work and study.|Совмещать работу и учёбу.
complete|завершать; полный|Complete the form.|Заполните форму.
confirm|подтверждать|Please confirm your booking.|Подтвердите бронирование.
connect|соединять, подключать|Connect to Wi-Fi.|Подключись к Wi-Fi.
contain|содержать|This drink contains sugar.|Этот напиток содержит сахар.
damage|повреждать; ущерб|The storm damaged the roof.|Буря повредила крышу.
disappear|исчезать|My keys disappeared.|Мои ключи исчезли.
divide|делить|Divide the cake into eight pieces.|Раздели торт на восемь кусков.
escape|сбегать|The prisoner escaped.|Заключённый сбежал.
exist|существовать|Do ghosts exist?|Призраки существуют?
expand|расширять(ся)|The company is expanding.|Компания расширяется.
fold|складывать (сгибая)|Fold the paper in half.|Сложи бумагу пополам.
force|заставлять; сила|Nobody forced you.|Никто тебя не заставлял.
gather|собирать(ся)|People gathered in the square.|Люди собрались на площади.
handle|справляться; ручка|I can handle it.|Я справлюсь.
hurry|спешить|Hurry up!|Поторопись!
identify|опознавать, определять|Can you identify the man?|Вы можете опознать этого человека?
ignore|игнорировать|Just ignore him.|Просто игнорируй его.
imagine|представлять|Imagine you're on a beach.|Представь, что ты на пляже.
inform|сообщать|Please inform us of any changes.|Сообщите нам об изменениях.
injure|травмировать|He was injured in an accident.|Он пострадал в аварии.
insist|настаивать|I insist!|Я настаиваю!
introduce|представлять, знакомить|Let me introduce myself.|Позвольте представиться.
limit|ограничивать; предел|Limit your screen time.|Ограничь время у экрана.
lean|наклоняться, опираться|Don't lean on the door.|Не опирайся на дверь.
mean to|собираться, намереваться|I didn't mean to hurt you.|Я не хотел тебя обидеть.
obey|подчиняться|Obey the rules.|Соблюдай правила.
occur|происходить|When did the accident occur?|Когда произошла авария?
perform|выступать, выполнять|The band performed live.|Группа выступила вживую.
permit|разрешать; разрешение|Smoking is not permitted.|Курение запрещено.
publish|публиковать|The book was published in 2020.|Книга вышла в 2020 году.
punish|наказывать|He was punished for lying.|Его наказали за ложь.
reflect|отражать; размышлять|The water reflects the sky.|Вода отражает небо.
release|выпускать; освобождать|The film will be released in May.|Фильм выйдет в мае.
remain|оставаться|Please remain seated.|Пожалуйста, оставайтесь на местах.
remove|удалять, убирать|Remove your shoes.|Снимите обувь.
rescue|спасать|Firefighters rescued the family.|Пожарные спасли семью.
reserve|бронировать|I reserved a table.|Я забронировал столик.
select|выбирать|Select an option.|Выберите вариант.
separate|разделять; отдельный|Separate the eggs.|Раздели яйца.
spread|распространять(ся)|The news spread quickly.|Новость быстро разлетелась.
supply|снабжать; запас|We supply restaurants.|Мы снабжаем рестораны.
surround|окружать|The house is surrounded by trees.|Дом окружён деревьями.
swap|меняться|Can we swap seats?|Можем поменяться местами?
tear|рвать|Don't tear the paper.|Не порви бумагу.
transform|преображать|The city was transformed.|Город преобразился.
vary|различаться|Prices vary.|Цены разные.
warn|предупреждать|I warned you!|Я же тебя предупреждал!
wrap|заворачивать|Wrap the present.|Заверни подарок.
#B2:verbs
abandon|бросать, покидать|They abandoned the car.|Они бросили машину.
accelerate|ускорять(ся)|The car accelerated.|Машина набрала скорость.
accumulate|накапливать(ся)|Dust accumulates quickly.|Пыль быстро накапливается.
allocate|выделять, распределять|We allocated money for training.|Мы выделили деньги на обучение.
alter|изменять|We had to alter our plans.|Пришлось изменить планы.
boost|повышать, усиливать|Coffee boosts my energy.|Кофе придаёт мне энергии.
collapse|рушиться|The building collapsed.|Здание обрушилось.
conduct|проводить (исследование)|We conducted a survey.|Мы провели опрос.
deteriorate|ухудшаться|His health deteriorated.|Его здоровье ухудшилось.
diminish|уменьшаться|The pain diminished.|Боль уменьшилась.
eliminate|устранять|We must eliminate errors.|Нужно устранить ошибки.
encounter|сталкиваться|We encountered a problem.|Мы столкнулись с проблемой.
endure|выносить, терпеть|I can't endure this pain.|Не могу терпеть эту боль.
exceed|превышать|Don't exceed the speed limit.|Не превышай скорость.
expose|подвергать; разоблачать|Don't expose your skin to the sun.|Не подставляй кожу солнцу.
foster|способствовать|We foster creativity.|Мы развиваем креативность.
generate|производить, генерировать|Wind turbines generate electricity.|Ветряки вырабатывают электричество.
hinder|мешать, препятствовать|Bad weather hindered the rescue.|Плохая погода мешала спасению.
illustrate|иллюстрировать|Let me illustrate with an example.|Поясню на примере.
launch|запускать|We launched a new product.|Мы запустили новый продукт.
modify|изменять|We modified the design.|Мы изменили дизайн.
monitor|отслеживать|Doctors monitor her condition.|Врачи следят за её состоянием.
postpone|откладывать|The match was postponed.|Матч перенесли.
prioritise|расставлять приоритеты|Learn to prioritise.|Научись расставлять приоритеты.
reassure|успокаивать, заверять|He reassured me it was fine.|Он заверил меня, что всё в порядке.
retrieve|извлекать, возвращать|I retrieved my files.|Я восстановил файлы.
simplify|упрощать|Let's simplify the process.|Давай упростим процесс.
strengthen|укреплять|Exercise strengthens muscles.|Упражнения укрепляют мышцы.
thrive|процветать|Some plants thrive in shade.|Некоторые растения хорошо растут в тени.
#A2:talk
chat|болтать; чат|Let's chat later.|Поболтаем позже.
discuss|обсуждать|Let's discuss it tomorrow.|Давай обсудим завтра.
reply|отвечать|She didn't reply to my message.|Она не ответила на сообщение.
thank|благодарить|Thank you for your help.|Спасибо за помощь.
apologise|извиняться|I apologise for being late.|Прошу прощения за опоздание.
whisper|шептать|Don't whisper!|Не шепчись!
joke|шутка; шутить|It was just a joke.|Это была просто шутка.
lie|лгать; ложь|Don't lie to me.|Не ври мне.
truth|правда|Tell me the truth.|Скажи мне правду.
secret|секрет|Can you keep a secret?|Умеешь хранить секреты?
conversation|разговор|We had a long conversation.|У нас был долгий разговор.
voice|голос|She has a beautiful voice.|У неё красивый голос.
greet|приветствовать|He greeted us at the door.|Он встретил нас у двери.
#B1:talk
communicate|общаться|We communicate in English.|Мы общаемся на английском.
express|выражать|Express your feelings.|Выражай свои чувства.
claim|утверждать; требование|He claims he's innocent.|Он утверждает, что невиновен.
confess|признаваться|He confessed to the crime.|Он признался в преступлении.
gossip|сплетни; сплетничать|Stop gossiping!|Хватит сплетничать!
interrupt|перебивать|Don't interrupt me.|Не перебивай меня.
respond|отвечать, реагировать|How did he respond?|Как он отреагировал?
argument|спор, ссора; довод|We had an argument.|Мы поссорились.
debate|дебаты; обсуждать|There's a big debate about it.|Об этом много спорят.
criticise|критиковать|Don't criticise others.|Не критикуй других.
compliment|комплимент|Thanks for the compliment!|Спасибо за комплимент!
praise|хвалить; похвала|The teacher praised him.|Учитель его похвалил.
request|просьба; просить|I have a small request.|У меня маленькая просьба.
apology|извинение|I owe you an apology.|Я должен перед тобой извиниться.
speech|речь|He gave a great speech.|Он произнёс отличную речь.
pronounce|произносить|How do you pronounce this?|Как это произносится?
#B2:talk
clarify|прояснять|Could you clarify that?|Можете пояснить?
elaborate|подробно излагать|Could you elaborate on that?|Можете рассказать подробнее?
persuasive|убедительный|She's very persuasive.|Она очень убедительна.
articulate|чётко выражать мысли|He's very articulate.|Он очень чётко излагает мысли.
disagreement|разногласие|We had a disagreement.|У нас вышло разногласие.
#A2:mind
believe|верить|I don't believe you.|Я тебе не верю.
mind|разум; возражать|Do you mind?|Ты не против?
memory|память; воспоминание|I have a bad memory.|У меня плохая память.
fact|факт|That's a fact.|Это факт.
true|правдивый, верный|Is it true?|Это правда?
false|ложный|True or false?|Правда или ложь?
#B1:mind
doubt|сомнение; сомневаться|I doubt it.|Сомневаюсь.
belief|вера, убеждение|It's my personal belief.|Это моё личное убеждение.
judgement|суждение|Use your judgement.|Решай по своему усмотрению.
logic|логика|There's no logic in it.|В этом нет логики.
estimate|оценивать (примерно)|I estimate it'll take a week.|Думаю, это займёт неделю.
focus|сосредоточиться; фокус|Focus on one thing.|Сосредоточься на чём-то одном.
analyse|анализировать|Let's analyse the results.|Давай проанализируем результаты.
conclusion|вывод|What's your conclusion?|Какой у тебя вывод?
intend|намереваться|I intend to finish today.|Я собираюсь закончить сегодня.
hesitate|колебаться|Don't hesitate to ask.|Не стесняйся спрашивать.
recall|вспоминать|I can't recall his name.|Не могу вспомнить его имя.
#B2:mind
perceive|воспринимать|How do others perceive you?|Как тебя воспринимают другие?
contemplate|обдумывать|I'm contemplating a career change.|Я подумываю сменить профессию.
speculate|строить догадки|It's too early to speculate.|Пока рано строить догадки.
deduce|делать вывод|What can we deduce from this?|Какой из этого можно сделать вывод?
intuition|интуиция|Trust your intuition.|Доверяй интуиции.
rational|рациональный|Let's be rational.|Давай мыслить здраво.
#A1:adj
fast|быстрый; быстро|He drives too fast.|Он ездит слишком быстро.
slow|медленный|The internet is slow.|Интернет медленный.
full|полный|The bus is full.|Автобус полный.
empty|пустой|The fridge is empty.|Холодильник пустой.
heavy|тяжёлый|This bag is heavy.|Эта сумка тяжёлая.
high|высокий|The mountain is very high.|Гора очень высокая.
low|низкий|Prices are low.|Цены низкие.
hard|твёрдый; трудный; усердно|It's hard to say.|Трудно сказать.
soft|мягкий|A soft pillow.|Мягкая подушка.
wet|мокрый|My shoes are wet.|Мои туфли мокрые.
dry|сухой|Is the paint dry?|Краска высохла?
dark|тёмный|It's dark outside.|На улице темно.
bright|яркий|A bright colour.|Яркий цвет.
closed|закрытый|The museum is closed today.|Музей сегодня закрыт.
#A2:adj
wide|широкий|A wide road.|Широкая дорога.
narrow|узкий|The streets are narrow.|Улицы узкие.
deep|глубокий|The lake is very deep.|Озеро очень глубокое.
huge|огромный|Their house is huge.|Их дом огромный.
tiny|крошечный|A tiny flat.|Крошечная квартира.
round|круглый|A round table.|Круглый стол.
sharp|острый|Be careful, the knife is sharp.|Осторожно, нож острый.
smooth|гладкий|Smooth skin.|Гладкая кожа.
rough|шершавый, грубый|Rough hands.|Грубые руки.
fantastic|фантастический|That's fantastic!|Это фантастика!
terrible|ужасный|What terrible weather!|Какая ужасная погода!
awful|ужасный|I feel awful.|Я ужасно себя чувствую.
amazing|потрясающий|The view is amazing.|Вид потрясающий.
excellent|превосходный|Excellent work!|Отличная работа!
perfect|идеальный|It's perfect!|Идеально!
normal|обычный, нормальный|It's normal to feel tired.|Чувствовать усталость — нормально.
special|особенный|Today is a special day.|Сегодня особенный день.
public|общественный|Public transport.|Общественный транспорт.
private|частный, личный|A private school.|Частная школа.
possible|возможный|Is it possible?|Это возможно?
impossible|невозможный|Nothing is impossible.|Нет ничего невозможного.
necessary|необходимый|Is it necessary?|Это обязательно?
useful|полезный|This app is very useful.|Это приложение очень полезное.
useless|бесполезный|This is useless.|Это бесполезно.
correct|правильный|Your answer is correct.|Твой ответ правильный.
alone|один, в одиночестве|I live alone.|Я живу один.
real|настоящий|Is it real?|Это по-настоящему?
modern|современный|Modern art.|Современное искусство.
traditional|традиционный|Traditional food.|Традиционная еда.
quick|быстрый|A quick question.|Быстрый вопрос.
noisy|шумный|The street is noisy.|Улица шумная.
crazy|сумасшедший|You're crazy!|Ты с ума сошёл!
#B1:adj
accurate|точный|The forecast was accurate.|Прогноз был точным.
actual|фактический, настоящий|The actual cost was higher.|Фактическая стоимость была выше.
complicated|сложный, запутанный|It's complicated.|Всё сложно.
complex|сложный, комплексный|A complex problem.|Сложная проблема.
efficient|эффективный|This method is more efficient.|Этот метод эффективнее.
effective|действенный|An effective treatment.|Действенное лечение.
enormous|огромный|An enormous amount of work.|Огромный объём работы.
equal|равный|Men and women are equal.|Мужчины и женщины равны.
extra|дополнительный|Extra time.|Дополнительное время.
extreme|крайний, экстремальный|Extreme weather.|Экстремальная погода.
fair|справедливый|It's not fair!|Это нечестно!
genuine|подлинный, искренний|A genuine smile.|Искренняя улыбка.
impressive|впечатляющий|That's impressive!|Впечатляет!
incredible|невероятный|The food was incredible.|Еда была невероятной.
major|главный, крупный|A major problem.|Серьёзная проблема.
minor|незначительный|A minor injury.|Лёгкая травма.
original|оригинальный, первоначальный|The original plan.|Первоначальный план.
particular|особый, конкретный|Is there a particular reason?|Есть какая-то конкретная причина?
pleasant|приятный|A pleasant surprise.|Приятный сюрприз.
practical|практичный|A practical solution.|Практичное решение.
precise|точный|Be more precise.|Говори точнее.
rare|редкий|A rare bird.|Редкая птица.
recent|недавний|In recent years.|В последние годы.
regular|регулярный, обычный|Regular exercise.|Регулярные тренировки.
relevant|относящийся к делу|That's not relevant.|Это к делу не относится.
severe|суровый, сильный|A severe headache.|Сильная головная боль.
silly|глупый|Don't be silly.|Не глупи.
similar|похожий|We have similar tastes.|У нас похожие вкусы.
specific|конкретный|Be specific.|Говори конкретно.
strict|строгий|My parents were strict.|Мои родители были строгими.
suitable|подходящий|Is this film suitable for kids?|Этот фильм подходит для детей?
temporary|временный|A temporary job.|Временная работа.
permanent|постоянный|A permanent contract.|Бессрочный договор.
typical|типичный|A typical day.|Обычный день.
unique|уникальный|Every person is unique.|Каждый человек уникален.
urgent|срочный|It's urgent!|Это срочно!
valuable|ценный|Valuable advice.|Ценный совет.
various|различный|For various reasons.|По разным причинам.
whole|целый|The whole day.|Весь день.
#B2:adj
abundant|обильный|Abundant natural resources.|Богатые природные ресурсы.
apparent|очевидный, видимый|For no apparent reason.|Без видимой причины.
appropriate|уместный|That's not appropriate.|Это неуместно.
arbitrary|произвольный|An arbitrary decision.|Произвольное решение.
coherent|связный, последовательный|A coherent argument.|Последовательный аргумент.
compatible|совместимый|Is it compatible with my phone?|Это совместимо с моим телефоном?
consistent|последовательный, стабильный|Be consistent.|Будь последовательным.
explicit|явный, недвусмысленный|Explicit instructions.|Чёткие инструкции.
feasible|осуществимый|Is the plan feasible?|План осуществим?
notorious|печально известный|A notorious criminal.|Печально известный преступник.
obsolete|устаревший|This technology is obsolete.|Эта технология устарела.
overwhelming|подавляющий, ошеломляющий|An overwhelming majority.|Подавляющее большинство.
prominent|видный, выдающийся|A prominent scientist.|Видный учёный.
redundant|избыточный; уволенный по сокращению|He was made redundant.|Его сократили.
straightforward|простой, понятный|It's quite straightforward.|Это довольно просто.
substantial|существенный|A substantial increase.|Существенный рост.
#A1:time
hour|час|I'll be back in an hour.|Вернусь через час.
minute|минута|Wait a minute.|Подожди минутку.
second|секунда; второй|Just a second.|Секунду.
month|месяц|See you next month.|Увидимся в следующем месяце.
Monday|понедельник|I hate Mondays.|Ненавижу понедельники.
Friday|пятница|Thank God it's Friday!|Слава богу, пятница!
Sunday|воскресенье|We rest on Sunday.|В воскресенье мы отдыхаем.
late|поздний; поздно|Sorry I'm late.|Извини за опоздание.
soon|скоро|See you soon!|До скорого!
then|потом; тогда|And then?|А потом?
o'clock|ровно (о времени)|It's five o'clock.|Пять часов.
calendar|календарь|Check your calendar.|Проверь календарь.
#A2:time
century|век|In the 21st century.|В XXI веке.
decade|десятилетие|For the last decade.|Последнее десятилетие.
moment|момент|Wait a moment.|Подожди минутку.
period|период|A short period of time.|Короткий промежуток времени.
past|прошлое; мимо|Forget the past.|Забудь прошлое.
present|настоящее; подарок|Live in the present.|Живи настоящим.
daily|ежедневный|Daily practice.|Ежедневная практика.
weekly|еженедельный|A weekly meeting.|Еженедельная встреча.
during|во время|During the film.|Во время фильма.
since|с (какого-то времени)|I've lived here since 2020.|Я живу здесь с 2020 года.
until|до (каких-то пор)|Wait until tomorrow.|Подожди до завтра.
while|пока, в то время как|While you were sleeping.|Пока ты спал.
yet|ещё (не); уже (в вопросе)|Not yet.|Ещё нет.
just|только что; просто|I've just arrived.|Я только что приехал.
ever|когда-либо|Have you ever been there?|Ты когда-нибудь там был?
forever|навсегда|I'll love you forever.|Буду любить тебя вечно.
lately|в последнее время|I've been busy lately.|Я в последнее время занят.
on time|вовремя|The train was on time.|Поезд пришёл вовремя.
in time|вовремя, успеть|We arrived just in time.|Мы успели как раз вовремя.
#B1:time
nowadays|в наше время|Nowadays everyone has a phone.|Сейчас у всех есть телефон.
meanwhile|тем временем|Meanwhile, at home…|Тем временем дома…
afterwards|впоследствии, потом|We had dinner afterwards.|Потом мы поужинали.
beforehand|заранее|Let me know beforehand.|Предупреди заранее.
occasionally|время от времени|I occasionally eat meat.|Иногда я ем мясо.
constantly|постоянно|He's constantly complaining.|Он постоянно жалуется.
frequently|часто|Frequently asked questions.|Часто задаваемые вопросы.
instantly|мгновенно|It works instantly.|Срабатывает мгновенно.
annual|ежегодный|An annual event.|Ежегодное мероприятие.
#B2:time
temporarily|временно|The shop is temporarily closed.|Магазин временно закрыт.
simultaneously|одновременно|They spoke simultaneously.|Они заговорили одновременно.
subsequently|впоследствии|He was subsequently arrested.|Впоследствии его арестовали.
initially|изначально|Initially, I didn't like it.|Сначала мне не понравилось.
#A2:link
so|поэтому; так|I was tired, so I went to bed.|Я устал, поэтому лёг спать.
or|или|Tea or coffee?|Чай или кофе?
and|и|You and me.|Ты и я.
than|чем|Better than nothing.|Лучше, чем ничего.
too|тоже; слишком|Me too.|Я тоже.
either|тоже (в отрицании); любой из двух|I don't like it either.|Мне это тоже не нравится.
both|оба|Both are fine.|Оба варианта подходят.
each|каждый|Each student has a book.|У каждого ученика есть книга.
every|каждый, все|Every day.|Каждый день.
anyway|в любом случае; короче|Anyway, let's go.|Короче, пошли.
perhaps|возможно|Perhaps you're right.|Возможно, ты прав.
quite|довольно|It's quite good.|Довольно неплохо.
rather|скорее, довольно|It's rather cold.|Довольно холодно.
except|кроме|Everyone except me.|Все, кроме меня.
#B1:link
besides|кроме того|Besides, it's too late.|К тому же уже слишком поздно.
moreover|более того|Moreover, it's free.|Более того, это бесплатно.
in addition|кроме того|In addition, we offer free delivery.|Кроме того, мы предлагаем бесплатную доставку.
as a result|в результате|As a result, prices rose.|В результате цены выросли.
for example|например|For example, take Paris.|Например, возьмём Париж.
such as|такой как, например|Fruit such as apples.|Фрукты, например яблоки.
in fact|на самом деле|In fact, it's easy.|На самом деле это легко.
of course|конечно|Of course I'll help.|Конечно, я помогу.
even though|хотя, даже несмотря на то что|Even though it was late, he called.|Хотя было поздно, он позвонил.
in case|на случай если|Take an umbrella in case it rains.|Возьми зонт на случай дождя.
as long as|пока, при условии что|You can stay as long as you want.|Можешь оставаться, сколько хочешь.
instead of|вместо|Tea instead of coffee.|Чай вместо кофе.
according to|согласно, по словам|According to the news, it'll rain.|По новостям, будет дождь.
in order to|чтобы|I study in order to get a better job.|Я учусь, чтобы найти работу получше.
on the whole|в целом|On the whole, it was good.|В целом было хорошо.
at least|по крайней мере|At least try it.|Хотя бы попробуй.
#B2:link
whereby|посредством которого|A system whereby users vote.|Система, при которой пользователи голосуют.
thus|таким образом|Thus, we need more time.|Таким образом, нам нужно больше времени.
albeit|хотя и|A small, albeit important, change.|Небольшое, хотя и важное изменение.
notwithstanding|несмотря на|Notwithstanding the risks, we continued.|Несмотря на риски, мы продолжили.
in terms of|с точки зрения|In terms of price, it's great.|По цене отлично.
with regard to|что касается|With regard to your question…|Что касается вашего вопроса…
#A2:goals
chance|шанс|Give me a chance.|Дай мне шанс.
luck|удача|Good luck!|Удачи!
difficulty|трудность|We had some difficulties.|У нас были трудности.
solution|решение (проблемы)|There's a simple solution.|Есть простое решение.
step|шаг|Take it step by step.|Делай шаг за шагом.
progress|прогресс|You're making progress.|Ты делаешь успехи.
practice|практика|Practice makes perfect.|Повторение — мать учения.
effect|эффект, воздействие|It had a big effect.|Это сильно повлияло.
example|пример|Give me an example.|Приведи пример.
#B1:goals
aim|цель; стремиться|What's your aim?|Какая у тебя цель?
achievement|достижение|It's a great achievement.|Это большое достижение.
ambition|амбиция, мечта|My ambition is to work abroad.|Моя мечта — работать за границей.
motivation|мотивация|I've lost my motivation.|Я потерял мотивацию.
obstacle|препятствие|Fear is the biggest obstacle.|Страх — главное препятствие.
improvement|улучшение|There's room for improvement.|Есть куда расти.
failure|неудача, провал|Failure is part of success.|Неудача — часть успеха.
dilemma|дилемма|I'm facing a dilemma.|Передо мной дилемма.
pressure|давление|I work well under pressure.|Я хорошо работаю под давлением.
potential|потенциал|You have great potential.|У тебя большой потенциал.
determination|решимость|Success takes determination.|Успех требует решимости.
#B2:goals
milestone|важный этап, веха|We reached an important milestone.|Мы достигли важного рубежа.
benchmark|ориентир, эталон|It's the industry benchmark.|Это отраслевой эталон.
discipline|дисциплина|Learning a language takes discipline.|Изучение языка требует дисциплины.
persistence|упорство|Persistence pays off.|Упорство окупается.
procrastination|прокрастинация|Procrastination kills productivity.|Прокрастинация убивает продуктивность.
#CH
Nice to meet you.|Приятно познакомиться.|Hi, I'm Tom. Nice to meet you.|Привет, я Том. Приятно познакомиться.
See you later.|Увидимся.|Bye! See you later.|Пока! Увидимся.
Take care.|Береги себя.|Bye, take care!|Пока, береги себя!
Thanks a lot.|Большое спасибо.|Thanks a lot for your help.|Большое спасибо за помощь.
You're welcome.|Пожалуйста (в ответ на спасибо).|Thank you! You're welcome.|Спасибо! Пожалуйста.
I'm sorry to hear that.|Мне жаль это слышать.|I'm sorry to hear that you're ill.|Жаль слышать, что ты болеешь.
What a shame!|Как жаль!|You can't come? What a shame!|Не сможешь прийти? Как жаль!
Never again.|Больше никогда.|I ate the whole pizza. Never again.|Я съел целую пиццу. Больше никогда.
Good for you!|Молодец! / Рад за тебя!|I passed the exam! Good for you!|Я сдал экзамен! Молодец!
Cheer up!|Не грусти! / Выше нос!|Cheer up, it's not the end of the world.|Выше нос, это не конец света.
Calm down.|Успокойся.|Calm down, everything's fine.|Успокойся, всё нормально.
Don't worry about it.|Не переживай об этом.|You broke a glass? Don't worry about it.|Разбил стакан? Не переживай.
It's on me.|Я угощаю.|Put your money away, it's on me.|Убери деньги, я угощаю.
I'm in.|Я в деле. / Я с вами.|Pizza tonight? I'm in!|Пицца вечером? Я за!
Count me in.|Я с вами.|A trip to the mountains? Count me in!|Поездка в горы? Я с вами!
I'm on my way.|Я уже еду / иду.|Don't worry, I'm on my way.|Не волнуйся, я уже еду.
It's up to me.|Решать мне.|Where we go is up to me.|Куда идти — решать мне.
I can't help it.|Ничего не могу с собой поделать.|I laugh at his jokes, I can't help it.|Смеюсь над его шутками, ничего не могу поделать.
You must be joking!|Ты шутишь!|It costs 1000 dollars? You must be joking!|Это стоит 1000 долларов? Ты шутишь!
No big deal.|Ерунда. / Ничего особенного.|Thanks for the lift! No big deal.|Спасибо, что подвёз! Ерунда.
Long time no see!|Сколько лет, сколько зим!|Hey, long time no see!|Привет, сколько лет, сколько зим!
Here you are.|Вот, пожалуйста (протягивая).|Can I have the salt? Here you are.|Передашь соль? Вот, держи.
Help yourself.|Угощайся.|There's cake in the kitchen, help yourself.|На кухне торт, угощайся.
After you.|Только после вас.|Please, after you.|Прошу, только после вас.
Mind your own business.|Не лезь не в своё дело.|Who I date? Mind your own business.|С кем я встречаюсь? Не твоё дело.
It serves you right.|Так тебе и надо.|You lost your money gambling? It serves you right.|Проиграл деньги? Так тебе и надо.
I'm fed up with|Мне надоело…|I'm fed up with this weather.|Мне надоела эта погода.
I'm sick of|Меня тошнит от… / Достало…|I'm sick of waiting.|Меня достало ждать.
It's not my cup of tea.|Это не моё.|Opera is not my cup of tea.|Опера — не моё.
Break a leg!|Ни пуха ни пера!|You have an exam? Break a leg!|У тебя экзамен? Ни пуха ни пера!
I'm all ears.|Я весь внимание.|Tell me everything, I'm all ears.|Рассказывай всё, я весь внимание.
Let's call it a day.|На сегодня хватит.|It's late, let's call it a day.|Уже поздно, давай на сегодня закончим.
It's a piece of cake.|Проще простого.|The test was a piece of cake.|Тест был проще простого.
Better late than never.|Лучше поздно, чем никогда.|You're here! Better late than never.|Ты пришёл! Лучше поздно, чем никогда.
What's going on?|Что происходит?|Why is everyone shouting? What's going on?|Почему все кричат? Что происходит?
Are you kidding?|Ты шутишь?|You won? Are you kidding?|Ты выиграл? Шутишь?
Just in case.|На всякий случай.|Take an umbrella, just in case.|Возьми зонт на всякий случай.
So far so good.|Пока всё хорошо.|How's the new job? So far so good.|Как новая работа? Пока всё хорошо.
I'll think about it.|Я подумаю.|Interesting offer. I'll think about it.|Интересное предложение. Я подумаю.
That's the point.|В этом-то и дело.|It's hard. That's the point.|Это сложно. В этом-то и дело.
Whatever you say.|Как скажешь.|Fine, whatever you say.|Ладно, как скажешь.
Up to now|До сих пор|Up to now, everything has been fine.|До сих пор всё было нормально.
It's about time.|Давно пора.|You cleaned your room? It's about time!|Ты убрал комнату? Давно пора!
I'd love to.|С удовольствием.|Would you like to come? I'd love to.|Хочешь прийти? С удовольствием.
I'm afraid not.|Боюсь, что нет.|Can you come tomorrow? I'm afraid not.|Сможешь прийти завтра? Боюсь, что нет.
I guess so.|Наверное, да.|Is it going to rain? I guess so.|Будет дождь? Наверное, да.
I don't think so.|Не думаю.|Is he coming? I don't think so.|Он придёт? Не думаю.
Could you do me a favour?|Можешь сделать мне одолжение?|Could you do me a favour and feed my cat?|Можешь покормить мою кошку?
How much is it?|Сколько это стоит?|I like this jacket. How much is it?|Мне нравится куртка. Сколько стоит?
Can I have the bill, please?|Можно счёт, пожалуйста?|We're finished. Can I have the bill, please?|Мы закончили. Можно счёт?
What do you do?|Кем ты работаешь?|So, what do you do?|Так кем ты работаешь?
Where are you from?|Откуда ты?|Where are you from? I'm from Russia.|Откуда ты? Я из России.
How long does it take?|Сколько это занимает времени?|How long does it take to get there?|Сколько туда добираться?
What's the matter?|Что случилось?|You look sad. What's the matter?|Ты грустный. Что случилось?
It's not worth it.|Оно того не стоит.|Don't argue with him, it's not worth it.|Не спорь с ним, оно того не стоит.
I didn't catch that.|Я не расслышал.|Sorry, I didn't catch that.|Извините, я не расслышал.
Let me know.|Дай знать.|Let me know if you need help.|Дай знать, если нужна помощь.
Keep me posted.|Держи меня в курсе.|Keep me posted about the interview.|Держи меня в курсе насчёт собеседования.
Give me a call.|Позвони мне.|Give me a call when you're free.|Позвони, когда освободишься.
Have a good one!|Всего хорошего!|Thanks, have a good one!|Спасибо, всего хорошего!
#PV
come back|возвращаться|When are you coming back?|Когда вернёшься?
come in|входить|Come in, please.|Входите, пожалуйста.
go out|выходить (гулять)|Let's go out tonight.|Давай сходим куда-нибудь вечером.
go on|продолжать; происходить|Go on, I'm listening.|Продолжай, я слушаю.
get back|возвращаться|I got back home late.|Я поздно вернулся домой.
sit down|садиться|Please sit down.|Садитесь, пожалуйста.
stand up|вставать|Stand up, please.|Встаньте, пожалуйста.
put on|надевать|Put on your coat.|Надень пальто.
take out|вынимать; выносить|Take out the rubbish.|Вынеси мусор.
fill in|заполнять (форму)|Fill in this form.|Заполните эту форму.
look at|смотреть на|Look at me.|Посмотри на меня.
run away|убегать|The dog ran away.|Собака убежала.
throw up|тошнить, рвать|I think I'm going to throw up.|Кажется, меня сейчас стошнит.
calm down|успокаиваться|Calm down, please.|Успокойся, пожалуйста.
cheer up|подбодрить; взбодриться|Cheer up!|Выше нос!
dress up|наряжаться|We dressed up for the party.|Мы нарядились на вечеринку.
eat out|есть вне дома|We eat out on Fridays.|По пятницам мы едим в ресторане.
fall down|падать|He fell down the stairs.|Он упал с лестницы.
get in|садиться (в машину)|Get in the car!|Садись в машину!
get out|выходить; выбираться|Get out of here!|Убирайся отсюда!
give back|возвращать|Give me back my phone.|Верни мне телефон.
hurry up|торопиться|Hurry up, we're late!|Быстрее, опаздываем!
log out|выйти (из аккаунта)|Don't forget to log out.|Не забудь выйти из аккаунта.
move in|въезжать|We moved in last week.|Мы въехали на прошлой неделе.
move out|съезжать|She moved out of her parents' house.|Она съехала от родителей.
pay back|возвращать долг|I'll pay you back tomorrow.|Я верну тебе завтра.
put away|убирать на место|Put away your toys.|Убери игрушки.
slow down|замедлять(ся)|Slow down, you're driving too fast!|Сбавь скорость, ты слишком быстро едешь!
switch off|выключать|Switch off the TV.|Выключи телевизор.
try out|пробовать, испытывать|Try out our new app.|Попробуйте наше новое приложение.
write down|записывать|Write down the address.|Запиши адрес.
back up|поддерживать; делать копию|Back up your files.|Сделай резервную копию файлов.
blow up|взрывать(ся)|The car blew up.|Машина взорвалась.
come across|наткнуться на|I came across an old photo.|Я наткнулся на старое фото.
cut down on|сокращать (потребление)|I'm cutting down on sugar.|Я сокращаю сахар.
drop out|бросить (учёбу)|He dropped out of university.|Он бросил университет.
fall apart|разваливаться|My shoes are falling apart.|Мои ботинки разваливаются.
fit in|вписываться|I didn't fit in at school.|Я не вписывался в коллектив в школе.
get away with|сойти с рук|He got away with it.|Ему это сошло с рук.
get rid of|избавляться от|I need to get rid of old clothes.|Мне надо избавиться от старой одежды.
give in|уступать, сдаваться|Don't give in.|Не сдавайся.
hold on|подождать; держаться|Hold on a minute.|Подожди минутку.
let down|подводить|Don't let me down.|Не подведи меня.
look into|изучать, расследовать|We'll look into it.|Мы с этим разберёмся.
make out|разобрать, различить|I can't make out what he's saying.|Не могу разобрать, что он говорит.
pass out|терять сознание|She passed out from the heat.|Она упала в обморок от жары.
point out|указывать (на что-то)|He pointed out my mistake.|Он указал на мою ошибку.
run into|случайно встретить|I ran into an old friend.|Я случайно встретил старого друга.
set off|отправляться в путь|We set off at dawn.|Мы выехали на рассвете.
stand out|выделяться|She really stands out.|Она сильно выделяется.
take after|быть похожим (на родственника)|He takes after his father.|Он похож на отца.
take over|брать на себя, захватывать|Who will take over the project?|Кто возьмёт на себя проект?
think over|обдумать|Think it over.|Обдумай это.
turn up|появляться; делать громче|He turned up late.|Он появился поздно.
use up|израсходовать|We used up all the milk.|Мы израсходовали всё молоко.
work on|работать над|I'm working on my accent.|Я работаю над акцентом.
#A1:time
one|один|One coffee, please.|Один кофе, пожалуйста.
two|два|Two tickets.|Два билета.
three|три|Three days.|Три дня.
four|четыре|Four people.|Четыре человека.
five|пять|Five minutes.|Пять минут.
six|шесть|Six o'clock.|Шесть часов.
seven|семь|Seven days a week.|Семь дней в неделю.
eight|восемь|Eight hours.|Восемь часов.
nine|девять|Nine euros.|Девять евро.
ten|десять|Ten years ago.|Десять лет назад.
twenty|двадцать|I'm twenty.|Мне двадцать.
hundred|сто|A hundred dollars.|Сто долларов.
thousand|тысяча|A thousand people.|Тысяча человек.
million|миллион|A million views.|Миллион просмотров.
half|половина|Half an hour.|Полчаса.
quarter|четверть|A quarter past two.|Четверть третьего.
#A2:verbs
seem|казаться|You seem tired.|Ты выглядишь уставшим.
become|становиться|She became a doctor.|Она стала врачом.
manage to|суметь, удаться|I managed to finish.|Мне удалось закончить.
need to|нужно|I need to go.|Мне нужно идти.
used to|раньше (что-то делал)|I used to live here.|Раньше я жил здесь.
#B1:work
career path|карьерный путь|Choose your career path.|Выбери карьерный путь.
workplace|рабочее место|A safe workplace.|Безопасное рабочее место.
office hours|рабочие часы|Call during office hours.|Звоните в рабочее время.
day off|выходной|Tomorrow is my day off.|Завтра у меня выходной.
sick leave|больничный|I'm on sick leave.|Я на больничном.
maternity leave|декретный отпуск|She's on maternity leave.|Она в декрете.
#B1:home
doorbell|дверной звонок|The doorbell rang.|Позвонили в дверь.
garage|гараж|The car is in the garage.|Машина в гараже.
basement|подвал|We keep old things in the basement.|Старые вещи храним в подвале.
attic|чердак|Boxes in the attic.|Коробки на чердаке.
fence|забор|A high fence.|Высокий забор.
gate|ворота, калитка|Close the gate.|Закрой калитку.
yard|двор|Kids play in the yard.|Дети играют во дворе.
lawn|газон|Mow the lawn.|Подстриги газон.
#A2:home
bin|мусорное ведро|Put it in the bin.|Выкинь в ведро.
bucket|ведро|A bucket of water.|Ведро воды.
candle|свеча|Light a candle.|Зажги свечу.
clock|часы (настенные)|The clock is slow.|Часы отстают.
curtain|штора|Close the curtains.|Задёрни шторы.
fan|вентилятор; фанат|Turn on the fan.|Включи вентилятор.
hairdryer|фен|Can I borrow your hairdryer?|Можно взять твой фен?
remote control|пульт|Where's the remote control?|Где пульт?
scissors|ножницы|Pass me the scissors.|Передай ножницы.
toothbrush|зубная щётка|I forgot my toothbrush.|Я забыл зубную щётку.
umbrella|зонт|Take an umbrella.|Возьми зонт.
washing machine|стиральная машина|The washing machine is broken.|Стиральная машина сломалась.
dishwasher|посудомоечная машина|Load the dishwasher.|Загрузи посудомойку.
microwave|микроволновка|Heat it in the microwave.|Разогрей в микроволновке.
kettle|чайник|Put the kettle on.|Поставь чайник.
pan|сковорода; кастрюля|Heat the oil in a pan.|Разогрей масло на сковороде.
hammer|молоток|Hand me the hammer.|Подай молоток.
ladder|стремянка, лестница|Climb the ladder carefully.|Осторожно поднимайся по стремянке.
#B1:verbs
adjust|настраивать, приспосабливаться|Adjust the seat.|Отрегулируй сиденье.
admire|восхищаться|I admire your courage.|Восхищаюсь твоей смелостью.
advise|советовать|I advise you to rest.|Советую тебе отдохнуть.
approve|одобрять|My parents approved.|Родители одобрили.
assist|помогать, содействовать|Can I assist you?|Могу я вам помочь?
beat|бить; обыгрывать|We beat them 3-0.|Мы обыграли их 3:0.
bet|спорить на; держать пари|I bet he'll be late.|Спорим, он опоздает.
breathe in|вдыхать|Breathe in slowly.|Медленно вдохни.
chase|гнаться|The dog chased the cat.|Собака погналась за кошкой.
consist of|состоять из|The team consists of five people.|Команда состоит из пяти человек.
cope|справляться|How do you cope?|Как ты справляешься?
dare|сметь|How dare you!|Как ты смеешь!
decorate|украшать; делать ремонт|We decorated the tree.|Мы нарядили ёлку.
defend|защищать|Defend yourself!|Защищайся!
demand|требовать; спрос|They demanded an apology.|Они потребовали извинений.
depend on|зависеть от|It depends on the price.|Зависит от цены.
design|проектировать; дизайн|She designs clothes.|Она придумывает одежду.
disagree|не соглашаться|I disagree with you.|Я с тобой не согласен.
dislike|не любить|I dislike crowds.|Не люблю толпу.
distract|отвлекать|Don't distract me.|Не отвлекай меня.
employ|нанимать, использовать|The company employs 500 people.|В компании работают 500 человек.
enter|входить|Enter your password.|Введите пароль.
examine|осматривать, исследовать|The doctor examined me.|Врач меня осмотрел.
fail to|не суметь|He failed to arrive on time.|Он не успел вовремя.
forgive|прощать|Please forgive me.|Пожалуйста, прости меня.
freeze|замерзать|The lake froze.|Озеро замёрзло.
keep up|поддерживать (темп)|Keep up the good work!|Так держать!
kneel|вставать на колени|He knelt down.|Он встал на колени.
lay|класть|Lay the table.|Накрой на стол.
lead|вести, руководить|She leads the team.|Она руководит командой.
offend|обижать|I didn't mean to offend you.|Я не хотел тебя обидеть.
organise|организовывать|She organised the party.|Она организовала вечеринку.
participate|участвовать|Everyone participated.|Участвовали все.
pretend|притворяться|He pretended to be asleep.|Он притворился спящим.
prove|доказывать|Prove it!|Докажи!
react|реагировать|How did she react?|Как она отреагировала?
rely|полагаться|You can rely on me.|Можешь на меня положиться.
respect|уважать; уважение|I respect your decision.|Уважаю твоё решение.
satisfy|удовлетворять|It's hard to satisfy him.|Ему трудно угодить.
scream|кричать (от страха)|She screamed.|Она закричала.
serve|подавать; обслуживать|Dinner is served.|Ужин подан.
settle|улаживать; поселиться|We settled in Moscow.|Мы обосновались в Москве.
stare|пристально смотреть|Don't stare at people.|Не пялься на людей.
struggle|бороться, с трудом справляться|I'm struggling with grammar.|Мне тяжело даётся грамматика.
suffer|страдать|She suffers from headaches.|Она страдает от головных болей.
suspect|подозревать|I suspect he's lying.|Подозреваю, что он врёт.
tend to|быть склонным|I tend to forget names.|Я обычно забываю имена.
threaten|угрожать|He threatened to quit.|Он пригрозил уволиться.
tolerate|терпеть|I can't tolerate rudeness.|Я не терплю грубости.
#B1:adj
absolute|абсолютный|Absolute silence.|Полная тишина.
awkward|неловкий|An awkward silence.|Неловкое молчание.
brilliant|блестящий, отличный|What a brilliant idea!|Какая блестящая идея!
challenging|сложный, требующий усилий|A challenging task.|Непростая задача.
common|распространённый, общий|A common mistake.|Распространённая ошибка.
competitive|конкурентный|A competitive salary.|Конкурентная зарплата.
confusing|запутанный|The instructions are confusing.|Инструкция запутанная.
creative|творческий|She's very creative.|Она очень творческая.
current|текущий|My current job.|Моя текущая работа.
dull|скучный, тусклый|A dull film.|Скучный фильм.
eager|жаждущий|I'm eager to start.|Мне не терпится начать.
emotional|эмоциональный|An emotional speech.|Эмоциональная речь.
entire|весь, целый|The entire city.|Весь город.
financial|финансовый|Financial problems.|Финансовые проблемы.
fond of|любящий|I'm fond of cats.|Я люблю кошек.
frequent|частый|Frequent flights.|Частые рейсы.
horrible|ужасный|A horrible smell.|Ужасный запах.
ideal|идеальный|The ideal place.|Идеальное место.
illegal|незаконный|It's illegal.|Это незаконно.
legal|законный|Is it legal?|Это законно?
messy|неопрятный, грязный|My room is messy.|В моей комнате бардак.
mysterious|загадочный|A mysterious stranger.|Загадочный незнакомец.
nasty|противный|A nasty cold.|Противная простуда.
official|официальный|The official website.|Официальный сайт.
ordinary|обычный|An ordinary day.|Обычный день.
overall|общий, в целом|The overall result.|Общий результат.
pleased|довольный|I'm pleased with my progress.|Я доволен своим прогрессом.
positive|положительный|A positive attitude.|Позитивный настрой.
negative|отрицательный|A negative review.|Отрицательный отзыв.
powerful|мощный|A powerful engine.|Мощный двигатель.
professional|профессиональный|A professional photographer.|Профессиональный фотограф.
proper|настоящий, правильный|A proper breakfast.|Нормальный завтрак.
romantic|романтичный|A romantic dinner.|Романтический ужин.
secure|надёжный, защищённый|A secure password.|Надёжный пароль.
sudden|внезапный|A sudden change.|Внезапная перемена.
tough|жёсткий, трудный|It's a tough decision.|Это трудное решение.
unusual|необычный|An unusual name.|Необычное имя.
violent|жестокий|A violent film.|Жестокий фильм.
weird|странный|That's weird.|Это странно.
willing|готовый, желающий|I'm willing to help.|Я готов помочь.
#B1:goals
balance|баланс|Work-life balance.|Баланс работы и жизни.
basis|основа|On a daily basis.|Ежедневно.
cause|причина; вызывать|What caused the accident?|Что стало причиной аварии?
decrease|уменьшение; уменьшаться|A decrease in sales.|Снижение продаж.
detail|подробность|Tell me the details.|Расскажи подробности.
factor|фактор|An important factor.|Важный фактор.
feature|особенность, функция|A new feature.|Новая функция.
growth|рост|Economic growth.|Экономический рост.
impact|влияние|It had a huge impact.|Это сильно повлияло.
level|уровень|What's your English level?|Какой у тебя уровень английского?
method|метод|A new method.|Новый метод.
option|вариант|We have two options.|У нас два варианта.
process|процесс|It's a slow process.|Это медленный процесс.
range|диапазон, ассортимент|A wide range of products.|Широкий ассортимент.
rate|темп, ставка|The interest rate.|Процентная ставка.
reaction|реакция|What was his reaction?|Какая была его реакция?
role|роль|She played a key role.|Она сыграла ключевую роль.
situation|ситуация|A difficult situation.|Сложная ситуация.
standard|стандарт|High standards.|Высокие стандарты.
structure|структура|The structure of a sentence.|Структура предложения.
system|система|The system doesn't work.|Система не работает.
trend|тенденция|A new trend.|Новая тенденция.
#B2:goals
aspect|аспект|Every aspect of life.|Каждый аспект жизни.
capacity|ёмкость; способность|Full capacity.|Полная загрузка.
circumstance|обстоятельство|Under the circumstances.|При таких обстоятельствах.
contribution|вклад|Thanks for your contribution.|Спасибо за вклад.
criterion|критерий|What's the main criterion?|Какой главный критерий?
dimension|измерение, аспект|A new dimension.|Новое измерение.
emphasis|акцент, упор|The emphasis is on speaking.|Упор на говорение.
framework|структура, рамки|A legal framework.|Правовая база.
initiative|инициатива|Take the initiative.|Проявляй инициативу.
mechanism|механизм|A defence mechanism.|Защитный механизм.
objective|цель; объективный|Our main objective.|Наша главная цель.
phenomenon|явление|A natural phenomenon.|Природное явление.
principle|принцип|It's a matter of principle.|Это дело принципа.
scope|масштаб, охват|The scope of the project.|Масштаб проекта.
sequence|последовательность|In the right sequence.|В правильной последовательности.
tendency|склонность, тенденция|He has a tendency to exaggerate.|Он склонен преувеличивать.
volume|объём; громкость|Turn down the volume.|Убавь громкость.
#B1:mind
attention|внимание|Pay attention!|Будь внимателен!
curiosity|любопытство|Curiosity killed the cat.|Любопытство до добра не доводит.
imagination|воображение|Use your imagination.|Включи воображение.
point of view|точка зрения|From my point of view…|С моей точки зрения…
sense|смысл; чувство|It makes sense.|Это логично.
thought|мысль|That's a good thought.|Хорошая мысль.
wisdom|мудрость|Age brings wisdom.|С возрастом приходит мудрость.
#B1:society
fine|штраф|I got a parking fine.|Мне выписали штраф за парковку.
tradition|традиция|It's a family tradition.|Это семейная традиция.
culture|культура|Russian culture.|Русская культура.
custom|обычай|Local customs.|Местные обычаи.
nation|нация, народ|The whole nation watched.|Вся страна смотрела.
society|общество|Modern society.|Современное общество.
majority|большинство|The majority agreed.|Большинство согласилось.
minority|меньшинство|A small minority.|Небольшое меньшинство.
generation gap|разрыв поколений|There's a big generation gap.|Большой разрыв между поколениями.
homeless|бездомный|Help the homeless.|Помогай бездомным.
#B2:society
discrimination|дискриминация|Discrimination is illegal.|Дискриминация незаконна.
bureaucracy|бюрократия|Too much bureaucracy.|Слишком много бюрократии.
censorship|цензура|Censorship of the media.|Цензура СМИ.
diversity|разнообразие|Cultural diversity.|Культурное разнообразие.
globalisation|глобализация|The effects of globalisation.|Последствия глобализации.
ideology|идеология|Political ideology.|Политическая идеология.
urban|городской|Urban areas.|Городские районы.
rural|сельский|Rural life.|Сельская жизнь.
#B1:health
lifestyle|образ жизни|A healthy lifestyle.|Здоровый образ жизни.
energy|энергия|I have no energy.|У меня нет сил.
vitamin|витамин|Take vitamins.|Принимай витамины.
calorie|калория|Count calories.|Считай калории.
yoga|йога|I do yoga every morning.|Я занимаюсь йогой каждое утро.
marathon|марафон|He ran a marathon.|Он пробежал марафон.
#B1:travel
adventure|приключение|What an adventure!|Вот это приключение!
campsite|кемпинг|We stayed at a campsite.|Мы остановились в кемпинге.
cruise|круиз|We went on a cruise.|Мы ездили в круиз.
currency|валюта|What's the local currency?|Какая местная валюта?
excursion|экскурсия|A boat excursion.|Экскурсия на лодке.
guided tour|экскурсия с гидом|We took a guided tour.|Мы взяли экскурсию с гидом.
hostel|хостел|We stayed in a cheap hostel.|Мы жили в дешёвом хостеле.
insurance|страховка|Do you have travel insurance?|У тебя есть туристическая страховка?
resort|курорт|A ski resort.|Горнолыжный курорт.
scenery|пейзаж|Beautiful scenery.|Красивый пейзаж.
sunbathe|загорать|We sunbathed all day.|Мы весь день загорали.
vehicle|транспортное средство|Park your vehicle here.|Оставьте машину здесь.
#B2:feel
cynical|циничный|Don't be so cynical.|Не будь таким циничным.
indifferent|равнодушный|He's indifferent to politics.|Он равнодушен к политике.
nostalgic|ностальгирующий|I feel nostalgic.|Меня тянет на ностальгию.
passionate|страстный, увлечённый|She's passionate about music.|Она увлечена музыкой.
reluctance|нежелание|He agreed with reluctance.|Он согласился неохотно.
sceptical|скептический|I'm sceptical about it.|Я в этом сомневаюсь.
spontaneous|спонтанный|A spontaneous decision.|Спонтанное решение.
#B2:work
accountable|подотчётный, ответственный|Managers are accountable for results.|Менеджеры отвечают за результат.
collaborate|сотрудничать|We collaborate with universities.|Мы сотрудничаем с университетами.
delegate|делегировать|Learn to delegate.|Научись делегировать.
efficiency|эффективность|Improve efficiency.|Повысить эффективность.
expertise|компетенция, экспертиза|We need your expertise.|Нам нужна твоя экспертиза.
leverage|использовать (с выгодой)|Leverage your experience.|Используй свой опыт.
negotiation|переговоры|Tough negotiations.|Трудные переговоры.
productivity|продуктивность|Productivity increased.|Продуктивность выросла.
resignation|увольнение по собственному|He handed in his resignation.|Он подал заявление об уходе.
shareholder|акционер|The shareholders approved it.|Акционеры одобрили.
workforce|рабочая сила, персонал|A skilled workforce.|Квалифицированные кадры.
#B2:study
assessment|оценивание|Continuous assessment.|Постоянное оценивание.
comprehension|понимание|Reading comprehension.|Понимание прочитанного.
enrol|записываться|I enrolled on a course.|Я записался на курс.
evidence-based|основанный на доказательствах|Evidence-based methods.|Методы, основанные на доказательствах.
methodology|методология|Research methodology.|Методология исследования.
plagiarism|плагиат|Plagiarism is not allowed.|Плагиат запрещён.
#A1:link
thing|вещь, штука|What's that thing?|Что это за штука?
something|что-то|I want to tell you something.|Хочу тебе кое-что сказать.
nothing|ничего|Nothing happened.|Ничего не случилось.
anything|что-нибудь; что угодно|Do you need anything?|Тебе что-нибудь нужно?
everything|всё|Everything is fine.|Всё хорошо.
someone|кто-то|Someone is at the door.|Кто-то у двери.
everyone|все, каждый|Everyone knows him.|Его все знают.
nobody|никто|Nobody came.|Никто не пришёл.
anybody|кто-нибудь|Is anybody here?|Здесь кто-нибудь есть?
somewhere|где-то, куда-то|Let's go somewhere.|Давай куда-нибудь сходим.
everywhere|везде|I looked everywhere.|Я искал везде.
all|все, всё|All my friends.|Все мои друзья.
some|несколько, немного|Some people.|Некоторые люди.
any|любой; какой-нибудь|Any questions?|Есть вопросы?
many|много (исчисл.)|Many people.|Много людей.
much|много (неисчисл.)|Not much.|Немного.
more|больше|I need more time.|Мне нужно больше времени.
most|большинство; самый|Most people agree.|Большинство согласны.
less|меньше|Less sugar, please.|Меньше сахара, пожалуйста.
only|только|Only one.|Только один.
other|другой|The other day.|На днях.
another|ещё один; другой|Another coffee?|Ещё кофе?
#A2:link
because of|из-за|Because of the rain.|Из-за дождя.
so that|чтобы|Speak louder so that I can hear.|Говори громче, чтобы я слышал.
as|как; так как|As you know…|Как ты знаешь…
whatever|что угодно|Do whatever you want.|Делай что хочешь.
whenever|когда угодно|Come whenever you like.|Приходи когда хочешь.
wherever|где угодно|I'll find you wherever you are.|Найду тебя, где бы ты ни был.
anyone|кто угодно|Anyone can do it.|Это может кто угодно.
none|ни один|None of them came.|Никто из них не пришёл.
several|несколько|Several times.|Несколько раз.
a few|несколько|A few minutes.|Несколько минут.
a little|немного|A little water.|Немного воды.
a lot of|много|A lot of work.|Много работы.
plenty of|полно|Plenty of time.|Полно времени.
#A1:goals
part|часть|Part of the problem.|Часть проблемы.
side|сторона|On the other side.|С другой стороны.
end|конец|The end of the film.|Конец фильма.
beginning|начало|At the beginning.|В начале.
middle|середина|In the middle of the night.|Посреди ночи.
top|верх|At the top of the page.|Вверху страницы.
bottom|низ, дно|At the bottom of the sea.|На дне моря.
group|группа|A group of friends.|Компания друзей.
line|линия; очередь|Wait in line.|Стой в очереди.
case|случай; дело|In that case.|В таком случае.
type|тип|What type of person is he?|Что он за человек?
form|форма; бланк|Fill in the form.|Заполни бланк.
list|список|A shopping list.|Список покупок.
piece|кусок, часть|A piece of cake.|Кусок торта.
#A2:goals
interest|интерес|I have no interest in it.|Мне это неинтересно.
power|сила, власть; электричество|There's no power.|Нет электричества.
member|член, участник|A family member.|Член семьи.
state|состояние; штат|In a bad state.|В плохом состоянии.
matter|дело, вопрос; иметь значение|What's the matter?|В чём дело?
event|событие|A big event.|Большое событие.
action|действие|Take action.|Действуй.
activity|занятие, деятельность|Outdoor activities.|Занятия на свежем воздухе.
shape|форма; состояние|In good shape.|В хорошей форме.
#A2:verbs
care|заботиться; забота|I don't care.|Мне всё равно.
take care of|заботиться о|Take care of yourself.|Береги себя.
clean up|убирать|Clean up your room.|Убери в комнате.
cross|пересекать|Cross the street.|Перейди улицу.
happen to|случаться с|What happened to you?|Что с тобой случилось?
spend time|проводить время|I spend time with my family.|Я провожу время с семьёй.
teach|учить, преподавать|She teaches English.|Она преподаёт английский.
#A2:people
guy|парень|He's a nice guy.|Он хороший парень.
lady|дама|Ladies and gentlemen.|Дамы и господа.
gentleman|джентльмен|He's a real gentleman.|Он настоящий джентльмен.
everybody|все|Hi, everybody!|Всем привет!
human|человек; человеческий|Human beings.|Люди.
#B1:people
personality|личность, характер|She has a strong personality.|У неё сильный характер.
role model|пример для подражания|My dad is my role model.|Папа — мой пример для подражания.
reputation|репутация|A good reputation.|Хорошая репутация.
`;
