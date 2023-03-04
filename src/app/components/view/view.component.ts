import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CaughtPokemonService } from 'src/app/services/caught-pokemon.service';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit {

  pokemon: any = null;
  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private pokedexService: PokedexService,
    private caughtPokemonService: CaughtPokemonService,
    ) { }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe(params => {
      if (this.pokedexService.pokemons.length) {
        this.pokemon = this.pokedexService.pokemons.find(i => i.name === params['name']);
        if (this.pokemon) {
          this.getEvolution();
          return;
        }
      }
      this.subscription = this.pokedexService.get(params['name']).subscribe(response => {
        this.pokemon = response;
        this.getEvolution();
      }, error => console.log('Error Occurred:', error));
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  getEvolution() {
    if (!this.pokemon.evolutions || !this.pokemon.evolutions.length) {
      this.pokemon.evolutions = [];
      this.subscription = this.pokedexService.getSpecies(this.pokemon.name).subscribe(response => {
        const id = this.getId(response.evolution_chain.url);
        this.subscription = this.pokedexService.getEvolution(id).subscribe(response => this.getEvolves(response.chain));
      });
    }
  }

  getEvolves(chain: any) {
    this.pokemon.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });
    if (chain.evolves_to.length) {
      this.getEvolves(chain.evolves_to[0]);
    }
  }

  getType(pokemon: any): string {
    return this.pokedexService.getType(pokemon);
  }

  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }
}
