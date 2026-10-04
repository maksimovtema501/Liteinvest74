/* Словарь «Лингво».
   Слова идут по уровням CEFR и внутри уровня — примерно по частотности:
   первые 2000 слов покрывают ~80–90% обычной речи, поэтому учим их первыми.
   Формат строки: слово|перевод|пример|перевод примера
   Заголовки: #A1…#B2 — обычные слова, #CH — разговорные фразы (чанки),
   #PV — фразовые глаголы. */
const WORDS_RAW = `
#A1
be|быть|I want to be a doctor.|Я хочу быть врачом.
have|иметь|I have two brothers.|У меня два брата.
do|делать|What do you do on Sundays?|Что ты делаешь по воскресеньям?
go|идти, ехать|We go to work by bus.|Мы ездим на работу на автобусе.
get|получать; становиться|I get a lot of emails.|Я получаю много писем.
make|делать, создавать|She makes great coffee.|Она делает отличный кофе.
know|знать|I don't know his name.|Я не знаю, как его зовут.
think|думать|I think you are right.|Я думаю, ты прав.
see|видеть|I can see the sea from here.|Отсюда я вижу море.
come|приходить|Come to my place tonight.|Приходи ко мне сегодня вечером.
want|хотеть|I want a new phone.|Я хочу новый телефон.
look|смотреть; выглядеть|Look at this photo.|Посмотри на это фото.
use|использовать|Can I use your pen?|Можно воспользоваться твоей ручкой?
find|находить|I can't find my keys.|Не могу найти ключи.
give|давать|Give me a minute.|Дай мне минутку.
tell|говорить, рассказывать|Tell me about your day.|Расскажи мне о своём дне.
work|работать; работа|I work from home.|Я работаю из дома.
call|звонить; называть|Call me later.|Позвони мне позже.
try|пытаться, пробовать|Try this cake.|Попробуй этот торт.
ask|спрашивать, просить|Can I ask you something?|Можно тебя кое о чём спросить?
need|нуждаться|I need some help.|Мне нужна помощь.
feel|чувствовать|I feel great today.|Я сегодня отлично себя чувствую.
leave|уходить, оставлять|I leave home at eight.|Я выхожу из дома в восемь.
put|класть, ставить|Put your bag here.|Поставь сумку сюда.
mean|значить, иметь в виду|What does this word mean?|Что значит это слово?
keep|держать, хранить|Keep the change.|Сдачи не надо.
let|позволять|Let me help you.|Давай я тебе помогу.
begin|начинать|The film begins at seven.|Фильм начинается в семь.
help|помогать; помощь|Can you help me?|Можешь мне помочь?
talk|разговаривать|We need to talk.|Нам нужно поговорить.
start|начинать|Let's start now.|Давай начнём сейчас.
show|показывать|Show me your ticket.|Покажи мне билет.
hear|слышать|I can't hear you.|Я тебя не слышу.
play|играть|The kids play outside.|Дети играют на улице.
run|бежать|I run every morning.|Я бегаю каждое утро.
live|жить|I live in a small town.|Я живу в маленьком городе.
bring|приносить|Bring your friends.|Приводи друзей.
happen|случаться|What happened?|Что случилось?
write|писать|Write your name here.|Напиши здесь своё имя.
sit|сидеть|Sit down, please.|Садитесь, пожалуйста.
stand|стоять|Don't stand there.|Не стой там.
lose|терять; проигрывать|I always lose my glasses.|Я вечно теряю очки.
pay|платить|Can I pay by card?|Можно оплатить картой?
meet|встречать|Nice to meet you.|Приятно познакомиться.
learn|учить, узнавать|I learn English every day.|Я учу английский каждый день.
understand|понимать|I don't understand.|Я не понимаю.
read|читать|I read before bed.|Я читаю перед сном.
speak|говорить (на языке)|Do you speak English?|Ты говоришь по-английски?
eat|есть|Let's eat something.|Давай что-нибудь поедим.
drink|пить|I drink a lot of water.|Я пью много воды.
sleep|спать|I sleep eight hours.|Я сплю восемь часов.
buy|покупать|I need to buy some milk.|Мне нужно купить молока.
sell|продавать|They sell fresh bread.|Они продают свежий хлеб.
open|открывать; открытый|Open the window, please.|Открой окно, пожалуйста.
close|закрывать|Close the door.|Закрой дверь.
wait|ждать|Wait for me!|Подожди меня!
love|любить|I love this song.|Я обожаю эту песню.
like|нравиться|I like your shoes.|Мне нравится твоя обувь.
watch|смотреть (фильм); часы|We watch TV in the evening.|Мы смотрим телевизор вечером.
walk|ходить пешком|I walk to school.|Я хожу в школу пешком.
cook|готовить еду|My dad cooks on Sundays.|Папа готовит по воскресеньям.
wash|мыть|Wash your hands.|Помой руки.
swim|плавать|Can you swim?|Ты умеешь плавать?
drive|водить машину|I drive to work.|Я езжу на работу на машине.
time|время; раз|I don't have time.|У меня нет времени.
year|год|I was born in that year.|Я родился в тот год.
people|люди|There are many people here.|Здесь много людей.
way|путь; способ|This is the best way.|Это лучший способ.
day|день|Have a nice day!|Хорошего дня!
man|мужчина|Who is that man?|Кто тот мужчина?
woman|женщина|She is a strong woman.|Она сильная женщина.
child|ребёнок|They have one child.|У них один ребёнок.
world|мир|I want to see the world.|Я хочу увидеть мир.
life|жизнь|Life is short.|Жизнь коротка.
hand|рука (кисть)|Raise your hand.|Подними руку.
place|место|This is a nice place.|Это хорошее место.
week|неделя|See you next week.|Увидимся на следующей неделе.
home|дом (родной)|I'm at home.|Я дома.
house|дом (здание)|They live in a big house.|Они живут в большом доме.
family|семья|My family is small.|У меня маленькая семья.
friend|друг|He is my best friend.|Он мой лучший друг.
money|деньги|I don't have much money.|У меня мало денег.
water|вода|Can I have some water?|Можно мне воды?
food|еда|The food here is great.|Еда здесь отличная.
room|комната|My room is small.|Моя комната маленькая.
school|школа|My son goes to school.|Мой сын ходит в школу.
city|город|Moscow is a big city.|Москва — большой город.
car|машина|My car is old.|Моя машина старая.
book|книга|This book is boring.|Эта книга скучная.
job|работа (должность)|I love my job.|Я люблю свою работу.
name|имя|What's your name?|Как тебя зовут?
morning|утро|I drink coffee in the morning.|Я пью кофе утром.
evening|вечер|What are you doing this evening?|Что делаешь сегодня вечером?
night|ночь|Good night!|Спокойной ночи!
door|дверь|Somebody is at the door.|Кто-то у двери.
phone|телефон|My phone is dead.|У меня сел телефон.
street|улица|I live on this street.|Я живу на этой улице.
shop|магазин|The shop is closed.|Магазин закрыт.
problem|проблема|No problem!|Без проблем!
question|вопрос|I have a question.|У меня вопрос.
word|слово|I don't know this word.|Я не знаю этого слова.
idea|идея|That's a good idea.|Это хорошая идея.
head|голова|My head hurts.|У меня болит голова.
face|лицо|Wash your face.|Умой лицо.
eye|глаз|She has blue eyes.|У неё голубые глаза.
mother|мать|My mother is a teacher.|Моя мама учитель.
father|отец|My father works a lot.|Мой отец много работает.
brother|брат|My brother is older than me.|Мой брат старше меня.
sister|сестра|I have a little sister.|У меня есть младшая сестра.
dog|собака|Our dog is very friendly.|Наша собака очень дружелюбная.
table|стол|The keys are on the table.|Ключи на столе.
bread|хлеб|We need bread.|Нам нужен хлеб.
coffee|кофе|A coffee, please.|Кофе, пожалуйста.
weather|погода|The weather is nice today.|Сегодня хорошая погода.
holiday|отпуск, праздник|We are on holiday.|Мы в отпуске.
ticket|билет|I bought two tickets.|Я купил два билета.
train|поезд|The train is late.|Поезд опаздывает.
bus|автобус|I take the bus.|Я езжу на автобусе.
good|хороший|This is a good book.|Это хорошая книга.
new|новый|I have a new job.|У меня новая работа.
first|первый|This is my first time here.|Я здесь впервые.
last|последний; прошлый|I saw him last week.|Я видел его на прошлой неделе.
long|длинный, долгий|It was a long day.|Это был долгий день.
great|отличный; великий|That's great!|Это здорово!
little|маленький; немного|I speak a little English.|Я немного говорю по-английски.
old|старый|My phone is old.|Мой телефон старый.
right|правильный; правый|You are right.|Ты прав.
big|большой|It's a big problem.|Это большая проблема.
different|разный, другой|We are very different.|Мы очень разные.
small|маленький|I live in a small flat.|Я живу в маленькой квартире.
next|следующий|See you next time.|Увидимся в следующий раз.
early|рано; ранний|I get up early.|Я встаю рано.
young|молодой|He is too young.|Он слишком молод.
important|важный|This is very important.|Это очень важно.
bad|плохой|I had a bad day.|У меня был плохой день.
same|тот же самый|We have the same phone.|У нас одинаковые телефоны.
happy|счастливый|I'm happy for you.|Я рад за тебя.
sad|грустный|Why are you sad?|Почему ты грустишь?
tired|уставший|I'm so tired.|Я так устал.
hungry|голодный|I'm hungry.|Я голоден.
cheap|дешёвый|This hotel is cheap.|Этот отель дешёвый.
expensive|дорогой|It's too expensive.|Это слишком дорого.
easy|лёгкий|This test is easy.|Этот тест лёгкий.
difficult|трудный|English is not difficult.|Английский не трудный.
hot|горячий, жаркий|It's hot today.|Сегодня жарко.
cold|холодный|The water is cold.|Вода холодная.
beautiful|красивый|What a beautiful day!|Какой прекрасный день!
free|свободный; бесплатный|Are you free tonight?|Ты свободен сегодня вечером?
busy|занятой|I'm busy right now.|Я сейчас занят.
ready|готовый|Are you ready?|Ты готов?
sure|уверенный|Are you sure?|Ты уверен?
very|очень|It's very cold.|Очень холодно.
really|действительно|I really like it.|Мне это правда нравится.
always|всегда|She is always late.|Она всегда опаздывает.
never|никогда|I never eat meat.|Я никогда не ем мясо.
often|часто|I often go there.|Я часто туда хожу.
sometimes|иногда|Sometimes I work at night.|Иногда я работаю ночью.
usually|обычно|I usually get up at seven.|Я обычно встаю в семь.
today|сегодня|What day is it today?|Какой сегодня день?
tomorrow|завтра|See you tomorrow.|До завтра.
yesterday|вчера|I saw her yesterday.|Я видел её вчера.
now|сейчас|I'm busy now.|Я сейчас занят.
here|здесь|Come here!|Иди сюда!
there|там|Put it there.|Положи это туда.
again|снова|Say it again.|Скажи ещё раз.
already|уже|I've already eaten.|Я уже поел.
still|всё ещё|Are you still here?|Ты всё ещё здесь?
also|также|I also speak French.|Я также говорю по-французски.
maybe|может быть|Maybe tomorrow.|Может быть, завтра.
together|вместе|Let's go together.|Пойдём вместе.
because|потому что|I'm late because of traffic.|Я опоздал из-за пробок.
but|но|I like it, but it's expensive.|Мне нравится, но это дорого.
if|если|Call me if you need help.|Позвони, если нужна помощь.
when|когда|When is your birthday?|Когда у тебя день рождения?
where|где, куда|Where do you live?|Где ты живёшь?
why|почему|Why are you laughing?|Почему ты смеёшься?
how|как|How are you?|Как дела?
what|что, какой|What time is it?|Который час?
who|кто|Who is calling?|Кто звонит?
which|который, какой (из)|Which one do you want?|Какой ты хочешь?
with|с|Come with me.|Пойдём со мной.
without|без|Coffee without sugar.|Кофе без сахара.
about|о; примерно|Let's talk about it.|Давай поговорим об этом.
before|перед, до|Wash your hands before lunch.|Мой руки перед обедом.
after|после|Let's meet after work.|Давай встретимся после работы.
between|между|The shop is between the bank and the cafe.|Магазин между банком и кафе.
breakfast|завтрак|I skip breakfast.|Я пропускаю завтрак.
lunch|обед|Let's have lunch together.|Давай пообедаем вместе.
dinner|ужин|Dinner is ready.|Ужин готов.
clothes|одежда|I need new clothes.|Мне нужна новая одежда.
hospital|больница|She works in a hospital.|Она работает в больнице.
music|музыка|What music do you like?|Какую музыку ты любишь?
film|фильм|Let's watch a film.|Давай посмотрим фильм.
picture|картина, фото|Take a picture of us.|Сфотографируй нас.
#A2
agree|соглашаться|I agree with you.|Я с тобой согласен.
allow|разрешать|Smoking is not allowed here.|Здесь курить запрещено.
arrive|прибывать|We arrived late.|Мы приехали поздно.
borrow|брать взаймы|Can I borrow your car?|Можно одолжить твою машину?
lend|давать взаймы|Can you lend me some money?|Можешь одолжить мне денег?
choose|выбирать|Choose one.|Выбери один.
decide|решать|I decided to stay.|Я решил остаться.
explain|объяснять|Can you explain this?|Можешь это объяснить?
forget|забывать|Don't forget your umbrella.|Не забудь зонт.
remember|помнить|I don't remember his name.|Я не помню, как его зовут.
hope|надеяться|I hope you're well.|Надеюсь, у тебя всё хорошо.
invite|приглашать|They invited us to the wedding.|Они пригласили нас на свадьбу.
miss|скучать; пропускать|I miss you.|Я скучаю по тебе.
offer|предлагать|They offered me a job.|Мне предложили работу.
plan|планировать; план|What are your plans?|Какие у тебя планы?
prefer|предпочитать|I prefer tea.|Я предпочитаю чай.
promise|обещать|I promise I'll call.|Обещаю, что позвоню.
remind|напоминать|Remind me tomorrow.|Напомни мне завтра.
return|возвращаться; возвращать|When do you return?|Когда ты возвращаешься?
send|отправлять|Send me the photos.|Пришли мне фотки.
spend|тратить; проводить (время)|I spend too much money.|Я трачу слишком много денег.
travel|путешествовать|I love to travel.|Я люблю путешествовать.
worry|волноваться|Don't worry.|Не волнуйся.
carry|нести|Can you carry this bag?|Можешь понести эту сумку?
change|менять; изменение|People don't change.|Люди не меняются.
check|проверять|Check your email.|Проверь почту.
compare|сравнивать|Don't compare yourself to others.|Не сравнивай себя с другими.
describe|описывать|Describe your room.|Опиши свою комнату.
enjoy|получать удовольствие|Enjoy your meal!|Приятного аппетита!
fail|проваливать, терпеть неудачу|I failed the exam.|Я провалил экзамен.
fall|падать|Be careful, don't fall.|Осторожно, не упади.
fill|наполнять|Fill in this form.|Заполните эту форму.
finish|заканчивать|I finish work at six.|Я заканчиваю работу в шесть.
follow|следовать|Follow me.|Следуй за мной.
grow|расти|Kids grow so fast.|Дети так быстро растут.
hate|ненавидеть|I hate Mondays.|Ненавижу понедельники.
hurt|болеть; ранить|My back hurts.|У меня болит спина.
join|присоединяться|Join us!|Присоединяйся к нам!
laugh|смеяться|Don't laugh at me.|Не смейся надо мной.
notice|замечать|I didn't notice you.|Я тебя не заметил.
order|заказывать; порядок|Are you ready to order?|Вы готовы сделать заказ?
pass|сдавать; проходить мимо|I passed the test!|Я сдал тест!
prepare|готовить(ся)|I need to prepare for the exam.|Мне нужно подготовиться к экзамену.
protect|защищать|Protect your eyes.|Береги глаза.
pull|тянуть|Pull the door.|Потяни дверь на себя.
push|толкать|Push the button.|Нажми кнопку.
reach|достигать, дотягиваться|I can't reach the shelf.|Я не могу дотянуться до полки.
receive|получать|Did you receive my message?|Ты получил моё сообщение?
repeat|повторять|Could you repeat that?|Не могли бы вы повторить?
save|сохранять; копить; спасать|I'm saving for a car.|Я коплю на машину.
share|делиться|Let's share the pizza.|Давай разделим пиццу.
smile|улыбаться|Smile!|Улыбнись!
steal|красть|Someone stole my bike.|Кто-то украл мой велосипед.
throw|бросать|Don't throw it away.|Не выбрасывай это.
win|побеждать, выигрывать|We won the game!|Мы выиграли игру!
wear|носить (одежду)|I wear glasses.|Я ношу очки.
advice|совет|Can I give you some advice?|Можно дать тебе совет?
answer|ответ; отвечать|I know the answer.|Я знаю ответ.
area|район, область|This is a quiet area.|Это тихий район.
bill|счёт|Can we have the bill, please?|Можно счёт, пожалуйста?
birthday|день рождения|Happy birthday!|С днём рождения!
boss|начальник|My boss is strict.|Мой начальник строгий.
choice|выбор|You have no choice.|У тебя нет выбора.
colleague|коллега|My colleagues are nice.|Мои коллеги приятные.
company|компания|I work for a big company.|Я работаю в большой компании.
country|страна|What country are you from?|Из какой ты страны?
customer|клиент, покупатель|The customer is always right.|Клиент всегда прав.
danger|опасность|You're in danger.|Ты в опасности.
decision|решение|It's a hard decision.|Это трудное решение.
difference|разница|What's the difference?|Какая разница?
dream|мечта; сон; мечтать|It's my dream job.|Это работа моей мечты.
experience|опыт; впечатление|I have no experience.|У меня нет опыта.
flat|квартира|We rent a flat.|Мы снимаем квартиру.
future|будущее|Think about your future.|Подумай о своём будущем.
guest|гость|We have guests tonight.|У нас сегодня гости.
health|здоровье|Health is more important than money.|Здоровье важнее денег.
information|информация|I need more information.|Мне нужно больше информации.
journey|поездка, путешествие|Have a safe journey!|Счастливого пути!
kitchen|кухня|She's in the kitchen.|Она на кухне.
language|язык|I speak three languages.|Я говорю на трёх языках.
law|закон|It's against the law.|Это противозаконно.
meal|приём пищи, блюдо|It was a great meal.|Это была отличная еда.
meeting|встреча, совещание|I have a meeting at ten.|У меня совещание в десять.
mistake|ошибка|Everybody makes mistakes.|Все совершают ошибки.
neighbour|сосед|Our neighbours are noisy.|Наши соседи шумные.
news|новости|I have good news.|У меня хорошие новости.
noise|шум|What's that noise?|Что это за шум?
opinion|мнение|In my opinion, it's wrong.|По-моему, это неправильно.
pain|боль|I have a pain in my back.|У меня болит спина.
price|цена|The price is too high.|Цена слишком высокая.
reason|причина|There's no reason to worry.|Нет причин волноваться.
result|результат|I'm happy with the result.|Я доволен результатом.
rule|правило|Those are the rules.|Таковы правила.
salary|зарплата|My salary is low.|У меня низкая зарплата.
season|время года, сезон|Summer is my favourite season.|Лето — моё любимое время года.
skill|навык|Communication is an important skill.|Общение — важный навык.
success|успех|Good luck and success!|Удачи и успехов!
trip|поездка|How was your trip?|Как съездил?
view|вид; взгляд|What a beautiful view!|Какой красивый вид!
village|деревня|My grandma lives in a village.|Моя бабушка живёт в деревне.
afraid|испуганный|I'm afraid of dogs.|Я боюсь собак.
angry|злой|Why are you angry?|Почему ты злишься?
boring|скучный|The film was boring.|Фильм был скучный.
interesting|интересный|That's an interesting idea.|Это интересная идея.
careful|осторожный|Be careful!|Будь осторожен!
clean|чистый; чистить|Keep your room clean.|Держи комнату в чистоте.
dirty|грязный|My car is dirty.|Моя машина грязная.
comfortable|удобный|This chair is comfortable.|Этот стул удобный.
dangerous|опасный|It's dangerous to swim here.|Здесь опасно плавать.
famous|знаменитый|He is a famous actor.|Он знаменитый актёр.
foreign|иностранный|Do you speak any foreign languages?|Ты говоришь на иностранных языках?
friendly|дружелюбный|People here are friendly.|Люди здесь дружелюбные.
funny|смешной|That's so funny!|Это так смешно!
healthy|здоровый|I try to eat healthy food.|Я стараюсь есть здоровую еду.
ill|больной|I feel ill.|Я чувствую себя больным.
kind|добрый; вид, сорт|You are very kind.|Вы очень добры.
lazy|ленивый|Don't be lazy.|Не ленись.
loud|громкий|The music is too loud.|Музыка слишком громкая.
lucky|везучий|You're so lucky!|Тебе так повезло!
nervous|нервный, взволнованный|I'm nervous before exams.|Я нервничаю перед экзаменами.
polite|вежливый|Be polite.|Будь вежлив.
popular|популярный|This cafe is very popular.|Это кафе очень популярное.
quiet|тихий|Be quiet, please.|Тише, пожалуйста.
rich|богатый|He is rich.|Он богат.
poor|бедный|They were very poor.|Они были очень бедны.
safe|безопасный|Is it safe here?|Здесь безопасно?
serious|серьёзный|Are you serious?|Ты серьёзно?
simple|простой|It's very simple.|Это очень просто.
strange|странный|That's strange.|Это странно.
strong|сильный|He is very strong.|Он очень сильный.
weak|слабый|I feel weak.|Я чувствую слабость.
wrong|неправильный|You're wrong.|Ты не прав.
almost|почти|I'm almost ready.|Я почти готов.
enough|достаточно|I don't have enough time.|У меня недостаточно времени.
especially|особенно|I love fruit, especially apples.|Я люблю фрукты, особенно яблоки.
finally|наконец|Finally, you're here!|Наконец-то ты здесь!
instead|вместо этого|Let's walk instead.|Давай лучше пройдёмся пешком.
later|позже|See you later.|Увидимся позже.
quickly|быстро|Come quickly!|Иди скорее!
slowly|медленно|Speak slowly, please.|Говорите медленно, пожалуйста.
suddenly|вдруг|Suddenly, the lights went out.|Вдруг погас свет.
probably|вероятно|It will probably rain.|Наверное, будет дождь.
once|однажды; один раз|I go to the gym once a week.|Я хожу в спортзал раз в неделю.
abroad|за границей|I want to work abroad.|Я хочу работать за границей.
ago|тому назад|I met him two years ago.|Я познакомился с ним два года назад.
own|собственный|I want my own room.|Я хочу собственную комнату.
rent|аренда; арендовать|The rent is too high.|Аренда слишком дорогая.
earn|зарабатывать|How much do you earn?|Сколько ты зарабатываешь?
improve|улучшать|I want to improve my English.|Я хочу улучшить свой английский.
#CH
How's it going?|Как дела?|Hey Tom, how's it going?|Привет, Том, как дела?
I'm not sure.|Я не уверен.|I'm not sure. Let me check.|Не уверен. Дай проверю.
It depends.|Зависит от обстоятельств.|It depends on the weather.|Это зависит от погоды.
That makes sense.|Это логично / понятно.|Oh, that makes sense now.|А, теперь понятно.
Could you repeat that?|Не могли бы вы повторить?|Sorry, could you repeat that?|Извините, не могли бы вы повторить?
What do you mean?|Что ты имеешь в виду?|What do you mean by that?|Что ты под этим имеешь в виду?
I'd rather|Я бы лучше…|I'd rather stay at home tonight.|Я бы лучше остался дома сегодня.
I'm looking for|Я ищу…|I'm looking for a pharmacy.|Я ищу аптеку.
Do you mind if…?|Ты не против, если…?|Do you mind if I open the window?|Ты не против, если я открою окно?
It's up to you.|Решать тебе.|Pizza or sushi? It's up to you.|Пицца или суши? Решай сам.
I can't stand|Терпеть не могу…|I can't stand waiting.|Терпеть не могу ждать.
I'm into|Я увлекаюсь…|I'm really into football.|Я очень увлекаюсь футболом.
I'm used to|Я привык к…|I'm used to getting up early.|Я привык рано вставать.
It's worth it.|Оно того стоит.|It's expensive, but it's worth it.|Дорого, но оно того стоит.
As far as I know|Насколько я знаю|As far as I know, he's on holiday.|Насколько я знаю, он в отпуске.
To be honest|Честно говоря|To be honest, I don't like it.|Честно говоря, мне не нравится.
By the way|Кстати|By the way, where is Anna?|Кстати, а где Анна?
In my opinion|По моему мнению|In my opinion, it's a bad idea.|По-моему, это плохая идея.
On the other hand|С другой стороны|On the other hand, it's cheap.|С другой стороны, это дёшево.
It turns out that|Оказывается, что…|It turns out that he was right.|Оказывается, он был прав.
I'm about to|Я как раз собираюсь…|I'm about to leave.|Я как раз ухожу.
Let me think.|Дай подумать.|Hmm, let me think.|Хм, дай подумать.
Fair enough.|Справедливо / Ладно, понял.|Fair enough, you can go.|Ладно, справедливо, можешь идти.
Never mind.|Неважно / Забей.|Never mind, I'll do it myself.|Забей, сам сделаю.
I have no idea.|Понятия не имею.|Where is he? I have no idea.|Где он? Понятия не имею.
Sounds good.|Звучит хорошо / Давай.|Dinner at eight? Sounds good.|Ужин в восемь? Давай.
What's the point?|Какой смысл?|What's the point of arguing?|Какой смысл спорить?
I'm running late.|Я опаздываю.|Sorry, I'm running late.|Извини, я опаздываю.
Take your time.|Не торопись.|No rush, take your time.|Не спеши, не торопись.
Make up your mind.|Определись / Решайся.|Come on, make up your mind!|Ну давай, решайся!
Keep in touch.|Будем на связи.|Good luck and keep in touch!|Удачи, будем на связи!
I couldn't agree more.|Полностью согласен.|You're right, I couldn't agree more.|Ты прав, полностью согласен.
That's not what I meant.|Я не это имел в виду.|No, that's not what I meant.|Нет, я не это имел в виду.
Hold on a second.|Подожди секунду.|Hold on a second, I'll get a pen.|Секунду, возьму ручку.
I'll get back to you.|Я тебе отвечу позже.|Let me check and I'll get back to you.|Дай проверю и отвечу тебе.
It's not a big deal.|Ничего страшного.|Don't worry, it's not a big deal.|Не переживай, ничего страшного.
Speaking of which|Кстати об этом|Speaking of which, did you call mum?|Кстати об этом, ты маме позвонил?
I was wondering if|Мне было интересно, не могли бы…|I was wondering if you could help me.|Я хотел спросить, не могли бы вы мне помочь.
How come?|Как так? / Почему?|How come you're still here?|Как так, ты всё ещё здесь?
What's up?|Как жизнь? / Что такое?|Hey, what's up?|Привет, как жизнь?
I'm good, thanks.|Нормально, спасибо.|How are you? I'm good, thanks.|Как ты? Нормально, спасибо.
Excuse me|Извините (привлечь внимание)|Excuse me, where is the station?|Извините, где вокзал?
No worries.|Не за что / Не парься.|Thanks! No worries.|Спасибо! Да не за что.
Same here.|Я тоже / У меня так же.|I'm tired. Same here.|Я устал. Я тоже.
Me neither.|Я тоже нет.|I don't like it. Me neither.|Мне не нравится. Мне тоже.
Good point.|Хорошее замечание.|Good point, I didn't think of that.|Верно подмечено, я не подумал.
It doesn't matter.|Это неважно.|It doesn't matter what they think.|Неважно, что они думают.
Go ahead.|Давай / Валяй.|Can I sit here? Sure, go ahead.|Можно сесть? Конечно, садись.
I see.|Понятно.|Oh, I see.|А, понятно.
#B1
achieve|достигать|You can achieve anything.|Ты можешь достичь чего угодно.
admit|признавать|I admit I was wrong.|Признаю, я был не прав.
afford|позволить себе (по деньгам)|I can't afford a new car.|Я не могу позволить себе новую машину.
appear|появляться; казаться|He appeared out of nowhere.|Он появился из ниоткуда.
apply|подавать заявку; применять|I applied for the job.|Я подал заявку на эту работу.
argue|спорить|Stop arguing!|Хватит спорить!
avoid|избегать|Avoid sugar.|Избегай сахара.
behave|вести себя|Behave yourself!|Веди себя прилично!
blame|винить|Don't blame me.|Не вини меня.
complain|жаловаться|He always complains.|Он вечно жалуется.
consider|рассматривать, обдумывать|We are considering moving.|Мы подумываем о переезде.
convince|убеждать|You convinced me.|Ты меня убедил.
create|создавать|We created a new app.|Мы создали новое приложение.
deal with|справляться с, иметь дело с|I'll deal with it.|Я с этим разберусь.
deny|отрицать|He denied everything.|Он всё отрицал.
depend|зависеть|It depends on you.|Это зависит от тебя.
deserve|заслуживать|You deserve it.|Ты это заслужил.
develop|развивать(ся)|We develop software.|Мы разрабатываем программы.
encourage|поощрять, вдохновлять|My parents encouraged me.|Родители меня поддерживали.
expect|ожидать|I didn't expect that.|Я этого не ожидал.
gain|получать, набирать|I gained five kilos.|Я набрал пять кило.
include|включать|Breakfast is included.|Завтрак включён.
increase|увеличивать(ся)|Prices increased again.|Цены снова выросли.
influence|влияние; влиять|He has a bad influence on you.|Он плохо на тебя влияет.
involve|вовлекать; подразумевать|The job involves a lot of travel.|Работа связана с частыми поездками.
manage|справляться; руководить|I managed to finish on time.|Мне удалось закончить вовремя.
mention|упоминать|Don't mention it.|Не за что.
persuade|уговаривать|She persuaded me to come.|Она уговорила меня прийти.
predict|предсказывать|Nobody can predict the future.|Никто не может предсказать будущее.
prevent|предотвращать|We must prevent this.|Мы должны это предотвратить.
produce|производить|The factory produces cars.|Завод производит машины.
provide|предоставлять|We provide free Wi-Fi.|Мы предоставляем бесплатный Wi-Fi.
realise|осознавать|I realised I was lost.|Я понял, что заблудился.
recognise|узнавать|I didn't recognise you!|Я тебя не узнал!
recommend|рекомендовать|What do you recommend?|Что посоветуете?
reduce|сокращать|Reduce your screen time.|Сократи время перед экраном.
refuse|отказываться|He refused to help.|Он отказался помочь.
regret|сожалеть|I regret nothing.|Я ни о чём не жалею.
rely on|полагаться на|You can rely on me.|На меня можно положиться.
replace|заменять|We need to replace the battery.|Нужно заменить батарейку.
require|требовать|This job requires experience.|Эта работа требует опыта.
solve|решать (проблему)|We solved the problem.|Мы решили проблему.
succeed|преуспевать|If you try hard, you'll succeed.|Если будешь стараться, у тебя получится.
suggest|предлагать (идею)|I suggest we take a break.|Предлагаю сделать перерыв.
support|поддерживать; поддержка|Thanks for your support.|Спасибо за поддержку.
suppose|полагать|I suppose you're right.|Полагаю, ты прав.
survive|выживать|Only three people survived.|Выжили только три человека.
waste|тратить впустую|Don't waste my time.|Не трать моё время.
ability|способность|She has the ability to lead.|У неё есть способность руководить.
advantage|преимущество|What are the advantages?|Какие преимущества?
disadvantage|недостаток|The main disadvantage is the price.|Главный недостаток — цена.
amount|количество, сумма|A huge amount of money.|Огромная сумма денег.
approach|подход|We need a new approach.|Нам нужен новый подход.
attempt|попытка|It was my first attempt.|Это была моя первая попытка.
attitude|отношение, настрой|I like your attitude.|Мне нравится твой настрой.
behaviour|поведение|His behaviour was strange.|Его поведение было странным.
benefit|польза, выгода|The benefits of sport are obvious.|Польза спорта очевидна.
career|карьера|He started his career in a bank.|Он начал карьеру в банке.
challenge|вызов, трудная задача|It's a real challenge.|Это настоящий вызов.
condition|состояние; условие|The car is in good condition.|Машина в хорошем состоянии.
confidence|уверенность|You need more confidence.|Тебе нужно больше уверенности.
consequence|последствие|Think about the consequences.|Подумай о последствиях.
crowd|толпа|There was a huge crowd.|Там была огромная толпа.
debt|долг|He's in debt.|Он в долгах.
effort|усилие|It takes a lot of effort.|Это требует много усилий.
environment|окружающая среда; обстановка|We must protect the environment.|Мы должны защищать окружающую среду.
evidence|доказательства|There is no evidence.|Нет доказательств.
goal|цель|What's your goal?|Какая у тебя цель?
habit|привычка|Smoking is a bad habit.|Курение — вредная привычка.
income|доход|They have a low income.|У них низкий доход.
issue|вопрос, проблема|That's a serious issue.|Это серьёзная проблема.
lack|нехватка|Lack of sleep is dangerous.|Недосып опасен.
opportunity|возможность|Don't miss this opportunity.|Не упусти эту возможность.
purpose|цель, назначение|What's the purpose of this?|Какова цель этого?
quality|качество|The quality is great.|Качество отличное.
relationship|отношения|They have a good relationship.|У них хорошие отношения.
research|исследование|Research shows that sleep is important.|Исследования показывают, что сон важен.
responsibility|ответственность|It's your responsibility.|Это твоя ответственность.
risk|риск|It's not worth the risk.|Это не стоит риска.
source|источник|What's your source?|Какой у тебя источник?
stress|стресс|I'm under a lot of stress.|Я в сильном стрессе.
task|задача|I have three tasks today.|У меня сегодня три задачи.
tool|инструмент|This app is a useful tool.|Это приложение — полезный инструмент.
value|ценность|Family is my main value.|Семья — моя главная ценность.
available|доступный, свободный|Is this room available?|Этот номер свободен?
aware|осведомлённый|Are you aware of the risks?|Ты знаешь о рисках?
confident|уверенный в себе|She is very confident.|Она очень уверена в себе.
convenient|удобный|Is ten o'clock convenient for you?|Тебе удобно в десять?
curious|любопытный|I'm just curious.|Мне просто любопытно.
disappointed|разочарованный|I'm disappointed in you.|Я в тебе разочарован.
embarrassed|смущённый|I was so embarrassed.|Мне было так неловко.
essential|необходимый|Water is essential for life.|Вода необходима для жизни.
exhausted|измотанный|I'm absolutely exhausted.|Я совершенно вымотан.
familiar|знакомый|Your face looks familiar.|Твоё лицо кажется знакомым.
flexible|гибкий|I have flexible hours.|У меня гибкий график.
generous|щедрый|Thank you, that's very generous.|Спасибо, это очень щедро.
grateful|благодарный|I'm grateful for your help.|Я благодарен за помощь.
guilty|виноватый|I feel guilty.|Я чувствую себя виноватым.
honest|честный|Be honest with me.|Будь со мной честен.
independent|независимый|She's very independent.|Она очень самостоятельная.
likely|вероятный|It's likely to rain.|Скорее всего, будет дождь.
obvious|очевидный|The answer is obvious.|Ответ очевиден.
patient|терпеливый; пациент|Be patient.|Будь терпелив.
previous|предыдущий|My previous job was boring.|Моя предыдущая работа была скучной.
proud|гордый|I'm proud of you.|Я горжусь тобой.
reasonable|разумный|That's a reasonable price.|Это разумная цена.
reliable|надёжный|He's very reliable.|Он очень надёжный.
responsible|ответственный|Who is responsible for this?|Кто за это отвечает?
rude|грубый|Don't be rude.|Не груби.
upset|расстроенный|Why are you upset?|Почему ты расстроен?
actually|на самом деле|Actually, I'm from Kazan.|Вообще-то я из Казани.
apparently|по-видимому, говорят|Apparently, he quit.|Говорят, он уволился.
certainly|конечно, несомненно|I'll certainly come.|Я обязательно приду.
completely|полностью|I completely forgot.|Я совсем забыл.
eventually|в конце концов|Eventually, he agreed.|В конце концов он согласился.
gradually|постепенно|Things are gradually getting better.|Всё постепенно налаживается.
hardly|едва, почти не|I can hardly hear you.|Я тебя почти не слышу.
immediately|немедленно|Call me immediately.|Позвони мне немедленно.
mostly|в основном|I mostly work from home.|Я в основном работаю из дома.
otherwise|иначе|Hurry up, otherwise we'll be late.|Поторопись, иначе опоздаем.
rarely|редко|I rarely eat out.|Я редко ем вне дома.
recently|недавно|I recently moved.|Я недавно переехал.
therefore|поэтому|I think, therefore I am.|Я мыслю, следовательно, существую.
though|хотя; однако|It's cold. I like it, though.|Холодно. Хотя мне нравится.
unless|если не|I won't go unless you come.|Я не пойду, если ты не пойдёшь.
whereas|тогда как|I like tea, whereas she likes coffee.|Я люблю чай, а она кофе.
although|хотя|Although it was late, we went out.|Хотя было поздно, мы пошли гулять.
despite|несмотря на|Despite the rain, we went.|Несмотря на дождь, мы пошли.
however|однако|However, there is a problem.|Однако есть проблема.
whether|ли|I don't know whether he'll come.|Не знаю, придёт ли он.
#PV
give up|сдаваться, бросать|Never give up!|Никогда не сдавайся!
find out|выяснять|I found out the truth.|Я узнал правду.
look after|присматривать за|Can you look after my cat?|Присмотришь за моей кошкой?
look forward to|ждать с нетерпением|I look forward to seeing you.|С нетерпением жду встречи.
put off|откладывать|Stop putting it off!|Хватит это откладывать!
run out of|заканчиваться (о запасах)|We ran out of milk.|У нас закончилось молоко.
turn down|отклонять; убавлять|She turned down the offer.|Она отклонила предложение.
come up with|придумывать|He came up with a great idea.|Он придумал отличную идею.
get along with|ладить с|I get along with my boss.|Я лажу со своим начальником.
figure out|разобраться, понять|I can't figure it out.|Не могу разобраться.
take up|начать заниматься|I took up yoga.|Я начал заниматься йогой.
carry on|продолжать|Carry on, please.|Продолжайте, пожалуйста.
set up|организовать, настроить|Let's set up a meeting.|Давай организуем встречу.
break down|ломаться|My car broke down.|У меня сломалась машина.
bring up|воспитывать; поднимать тему|Don't bring it up again.|Не поднимай эту тему снова.
get over|пережить, оправиться|You'll get over it.|Ты это переживёшь.
make up|выдумывать; мириться|He made up a story.|Он выдумал историю.
show up|появляться, приходить|He didn't show up.|Он не пришёл.
end up|в итоге оказаться|We ended up in a small bar.|В итоге мы оказались в маленьком баре.
work out|тренироваться; получаться|I work out three times a week.|Я тренируюсь три раза в неделю.
look up|искать (в словаре, сети)|Look it up online.|Поищи это в интернете.
put up with|терпеть, мириться с|I can't put up with this noise.|Я не могу терпеть этот шум.
go through|проходить через, переживать|She went through a lot.|Она через многое прошла.
keep up with|поспевать за|I can't keep up with you.|Я не поспеваю за тобой.
call off|отменять|They called off the meeting.|Они отменили встречу.
catch up|догнать; наверстать|Let's catch up over coffee.|Давай встретимся за кофе и поболтаем.
hang out|тусоваться|We hang out on Fridays.|Мы тусуемся по пятницам.
sort out|уладить, разобраться|I'll sort it out.|Я это улажу.
take off|взлетать; снимать (одежду)|The plane took off.|Самолёт взлетел.
turn out|оказываться|It turned out fine.|Всё обошлось хорошо.
pick up|подобрать, забрать|I'll pick you up at six.|Я заберу тебя в шесть.
wake up|просыпаться|I wake up at seven.|Я просыпаюсь в семь.
get up|вставать|Get up, it's late!|Вставай, уже поздно!
look for|искать|What are you looking for?|Что ты ищешь?
grow up|вырастать|I grew up in Chelyabinsk.|Я вырос в Челябинске.
#B2
acknowledge|признавать|He acknowledged his mistake.|Он признал свою ошибку.
adapt|приспосабливаться|We adapted quickly.|Мы быстро адаптировались.
anticipate|предвидеть|We didn't anticipate this problem.|Мы не предвидели этой проблемы.
assess|оценивать|We need to assess the damage.|Нужно оценить ущерб.
assume|предполагать, считать|I assume you know him.|Полагаю, ты его знаешь.
cope with|справляться с|How do you cope with stress?|Как ты справляешься со стрессом?
compromise|компромисс; идти на компромисс|We reached a compromise.|Мы пришли к компромиссу.
contribute|вносить вклад|Everyone contributed to the project.|Все внесли вклад в проект.
determine|определять|Genes determine eye colour.|Гены определяют цвет глаз.
emerge|появляться, выясняться|New problems emerged.|Возникли новые проблемы.
emphasise|подчёркивать|I want to emphasise this point.|Я хочу подчеркнуть этот момент.
enhance|улучшать, усиливать|This will enhance your skills.|Это улучшит твои навыки.
ensure|гарантировать, обеспечивать|Please ensure the door is locked.|Убедитесь, что дверь заперта.
evaluate|оценивать|We evaluate results every month.|Мы оцениваем результаты каждый месяц.
exaggerate|преувеличивать|Don't exaggerate!|Не преувеличивай!
implement|внедрять|We implemented a new system.|Мы внедрили новую систему.
imply|подразумевать|What are you implying?|На что ты намекаешь?
indicate|указывать|Studies indicate a link.|Исследования указывают на связь.
interpret|толковать|How do you interpret this?|Как ты это понимаешь?
justify|оправдывать|Nothing can justify violence.|Ничто не оправдывает насилие.
maintain|поддерживать; утверждать|It's hard to maintain a healthy diet.|Трудно придерживаться здорового питания.
neglect|пренебрегать|Don't neglect your health.|Не пренебрегай здоровьем.
obtain|получать, добывать|You must obtain a visa.|Нужно получить визу.
overcome|преодолевать|She overcame her fear.|Она преодолела свой страх.
overlook|упускать из виду|We overlooked an important detail.|Мы упустили важную деталь.
pursue|преследовать (цель)|Pursue your dreams.|Следуй за своей мечтой.
reinforce|укреплять|Repetition reinforces memory.|Повторение укрепляет память.
resolve|разрешать (конфликт)|We need to resolve this issue.|Нужно решить этот вопрос.
restrict|ограничивать|Access is restricted.|Доступ ограничен.
reveal|раскрывать|He revealed the secret.|Он раскрыл секрет.
seek|искать, стремиться|They are seeking help.|Они ищут помощи.
sustain|поддерживать, выдерживать|We can't sustain this pace.|Мы не выдержим такой темп.
undermine|подрывать|This undermines trust.|Это подрывает доверие.
withdraw|снимать (деньги); отзывать|I need to withdraw some cash.|Мне нужно снять наличные.
assumption|предположение|That's a wrong assumption.|Это неверное предположение.
awareness|осведомлённость|We need to raise awareness.|Нужно повышать осведомлённость.
bias|предвзятость|Everyone has some bias.|У всех есть предвзятость.
breakthrough|прорыв|It was a scientific breakthrough.|Это был научный прорыв.
burden|бремя|I don't want to be a burden.|Я не хочу быть обузой.
commitment|обязательство, преданность|It requires a lot of commitment.|Это требует большой самоотдачи.
concern|беспокойство; касаться|There is growing concern.|Растёт беспокойство.
drawback|недостаток|The only drawback is the noise.|Единственный минус — шум.
feedback|обратная связь|Thanks for the feedback.|Спасибо за обратную связь.
implication|последствие, вывод|What are the implications?|Какие последствия?
incentive|стимул|There's no incentive to work harder.|Нет стимула работать больше.
insight|понимание, озарение|That's a great insight.|Очень ценное наблюдение.
outcome|исход, результат|We're happy with the outcome.|Мы довольны результатом.
perspective|точка зрения|Try to see it from my perspective.|Попробуй взглянуть с моей точки зрения.
priority|приоритет|Safety is our top priority.|Безопасность — наш главный приоритет.
setback|неудача, откат|It's just a temporary setback.|Это просто временная неудача.
shortage|нехватка|There is a water shortage.|Не хватает воды.
strategy|стратегия|What's our strategy?|Какая у нас стратегия?
threat|угроза|It's a serious threat.|Это серьёзная угроза.
workload|нагрузка|My workload is huge.|У меня огромная нагрузка.
adequate|достаточный, адекватный|The salary is adequate.|Зарплата достойная.
ambiguous|двусмысленный|The answer was ambiguous.|Ответ был двусмысленным.
comprehensive|всесторонний|A comprehensive guide.|Исчерпывающее руководство.
considerable|значительный|A considerable amount of time.|Значительное количество времени.
crucial|решающий|This is a crucial moment.|Это решающий момент.
deliberate|намеренный|It was a deliberate lie.|Это была намеренная ложь.
inevitable|неизбежный|Change is inevitable.|Перемены неизбежны.
plausible|правдоподобный|That sounds plausible.|Звучит правдоподобно.
profound|глубокий|It had a profound effect on me.|Это глубоко на меня повлияло.
reluctant|неохотный|He was reluctant to help.|Он неохотно помогал.
subtle|тонкий, едва заметный|There's a subtle difference.|Есть тонкая разница.
sufficient|достаточный|We have sufficient evidence.|У нас достаточно доказательств.
thorough|тщательный|He did a thorough job.|Он сделал работу тщательно.
tremendous|огромный|It was a tremendous success.|Это был огромный успех.
vague|расплывчатый|His answer was vague.|Его ответ был расплывчатым.
vulnerable|уязвимый|Children are vulnerable.|Дети уязвимы.
worthwhile|стоящий|It's a worthwhile investment.|Это стоящее вложение.
arguably|пожалуй, возможно|He's arguably the best player.|Он, пожалуй, лучший игрок.
consequently|следовательно|Consequently, prices rose.|Следовательно, цены выросли.
furthermore|более того|Furthermore, it's cheap.|Более того, это дёшево.
nevertheless|тем не менее|It was hard. Nevertheless, we did it.|Было трудно. Тем не менее, мы справились.
presumably|предположительно|Presumably, he's at home.|Он, вероятно, дома.
ultimately|в конечном счёте|Ultimately, it's your choice.|В конечном счёте, это твой выбор.
merely|всего лишь|It's merely a suggestion.|Это всего лишь предложение.
`;

/* Слова для теста словарного запаса. Полосы — по частотности:
   ранг 1–1000, 1000–2000, 2000–4000, 4000–8000, 8000–16000.
   FAKE — несуществующие слова: кто «знает» их, тот угадывает, и это вычитается. */
const VOCAB_TEST = {
  bands: [
    { size: 1000, words: ["house", "water", "friend", "buy", "morning", "money", "happy", "window"] },
    { size: 1000, words: ["borrow", "weather", "journey", "neighbour", "honest", "cheat", "border", "bury"] },
    { size: 2000, words: ["reluctant", "shelter", "obey", "grief", "harsh", "tide", "venue", "widespread"] },
    { size: 4000, words: ["meticulous", "lenient", "brittle", "smother", "dwindle", "stern", "hoax", "quaint"] },
    { size: 8000, words: ["ubiquitous", "cajole", "pithy", "obfuscate", "truculent", "lissom", "soporific", "garrulous"] }
  ],
  fake: ["plaudate", "fellick", "mensible", "brontish", "kermshaw", "gloviate", "smordle", "vorpent", "clamish", "dreffy", "spaunt", "merlage"]
};
