import { 
    JsonController,
    Get,   
    Param, 
    Put, 
    Body, 
    NotFoundError, 
    Post, 
    HttpCode,
    BodyParam,
    BadRequestError 
    } from 'routing-controllers'

import Game from './entity'

function contains(array, search)
{
    return array.indexOf(search) >= 0;
}

const colors = ['red', 'blue', 'green', 'yellow', 'magenta']

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
}

const moves = (board1, board2) => 
  board1
    .map((row, y) => row.filter((cell, x) => board2[y][x] !== cell))
    .reduce((a, b) => a.concat(b))
    .length


@JsonController()
export default class UserController {

    @Get('/games')
    async allGames() {
      const games = await Game.find()
      return { games }
    }

    @Post('/games')
    @HttpCode(201)
    createGame(
    @BodyParam("name") name : string
    ){
    const game = new Game()
    game.name = name
    game.color = randomColor()
    return game.save()
    }

    @Put('/games/:id')
    async updateGame(
    @Param('id') id: number,
    @Body() update: Partial<Game>
    ) {
    const game = await Game.findOne(id)
    if (!game) throw new NotFoundError('game not found')

    const color = update.color
    if ( !contains(colors, color)) {
        throw new NotFoundError('Not a possible color')
    }  
    
    if( moves(game.board, update.board) !== 1) throw new BadRequestError('HTTP 400 Bad Request')
    
    // update.id = undefined

    return Game.merge(game, update).save()
    }
    
}